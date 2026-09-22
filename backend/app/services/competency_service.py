"""Deterministic, Explainable Competency Matching Engine for Institutional Capacity Building."""
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.errors import NotFoundError
from app.db.models import CompetencyRequirement, User
from app.schemas.all_schemas import (
    CompetencyMatchResponse,
    CompetencyRequirementCreate,
    CompetencyRequirementOut,
    MatchComponentBreakdown,
    TrainerMatchResult,
)


class CompetencyService:
    @staticmethod
    def create_requirement(
        db: Session,
        req: CompetencyRequirementCreate,
        creator: User,
    ) -> CompetencyRequirement:
        """Create a new institutional competency requirement."""
        requirement = CompetencyRequirement(
            title=req.title,
            description=req.description,
            target_role=req.target_role,
            department=req.department,
            required_skills=[s.model_dump() for s in req.required_skills],
            required_subjects=req.required_subjects,
            min_experience_years=req.min_experience_years,
            min_qualification=req.min_qualification,
            created_by_id=creator.id,
        )
        db.add(requirement)
        db.commit()
        db.refresh(requirement)
        return requirement

    @staticmethod
    def list_requirements(db: Session) -> list[CompetencyRequirementOut]:
        """List all competency requirements."""
        items = db.scalars(
            select(CompetencyRequirement).order_by(CompetencyRequirement.created_at.desc())
        ).all()
        return [CompetencyRequirementOut.model_validate(item) for item in items]

    @staticmethod
    def evaluate_matching(
        db: Session,
        requirement_id: uuid.UUID,
    ) -> CompetencyMatchResponse:
        """Execute deterministic weighted matching formula across all active trainers."""
        req = db.scalar(select(CompetencyRequirement).where(CompetencyRequirement.id == requirement_id))
        if not req:
            raise NotFoundError("Competency requirement not found.", code="REQUIREMENT_NOT_FOUND")

        trainers = db.scalars(
            select(User)
            .options(joinedload(User.trainer_profile))
            .where(User.role == "trainer", User.status == "active")
        ).all()

        results: list[TrainerMatchResult] = []

        for user in trainers:
            prof = user.trainer_profile
            if not prof:
                continue

            trainer_skills_dict = {
                s.get("name", "").lower(): float(s.get("level", 3))
                for s in (prof.skills or [])
            }
            trainer_subjects_lower = [s.lower() for s in (prof.expertise_subjects or [])]

            # 1. S_skill computation
            total_weight = 0.0
            weighted_skill_score = 0.0
            matched_skills: list[str] = []
            missing_skills: list[str] = []
            proficiency_ratios: list[float] = []

            for r_skill in (req.required_skills or []):
                name = r_skill.get("name", "").lower()
                target_level = float(r_skill.get("min_level", 3))
                weight = float(r_skill.get("weight", 3))
                total_weight += weight

                if name in trainer_skills_dict:
                    actual_lvl = trainer_skills_dict[name]
                    ratio = min(1.0, actual_lvl / max(1.0, target_level))
                    weighted_skill_score += weight * ratio
                    matched_skills.append(r_skill.get("name", name))
                    proficiency_ratios.append(ratio)
                else:
                    missing_skills.append(r_skill.get("name", name))

            s_skill = (weighted_skill_score / total_weight) if total_weight > 0 else 0.5
            s_proficiency = (sum(proficiency_ratios) / len(proficiency_ratios)) if proficiency_ratios else 0.2

            # 2. S_subject computation
            req_subjects = [s.lower() for s in (req.required_subjects or [])]
            if req_subjects:
                subj_matches = 0
                for r_subj in req_subjects:
                    if any(r_subj in t_subj or t_subj in r_subj for t_subj in trainer_subjects_lower):
                        subj_matches += 1
                s_subject = min(1.0, subj_matches / len(req_subjects))
            else:
                s_subject = 0.8

            # 3. S_experience computation
            s_experience = min(1.0, prof.experience_years / max(1.0, req.min_experience_years))

            # 4. S_qualification computation
            s_qualification = 0.8  # Default institutional baseline

            # Final Deterministic Weighted Score (0 to 100)
            total_score = 100.0 * (
                0.40 * s_skill
                + 0.20 * s_subject
                + 0.15 * s_proficiency
                + 0.15 * s_experience
                + 0.10 * s_qualification
            )
            total_score = round(min(100.0, max(0.0, total_score)), 1)

            # Generate human-readable explanation
            explanation = (
                f"{user.full_name} scored {total_score}/100. "
                f"Matched {len(matched_skills)}/{len(req.required_skills or [])} required competencies "
                f"with {round(s_skill * 100)}% skill coverage and {prof.experience_years} years relevant experience."
            )

            results.append(
                TrainerMatchResult(
                    trainer_id=user.id,
                    trainer_name=user.full_name,
                    email=user.email,
                    organization=user.organization,
                    experience_years=prof.experience_years,
                    total_score=total_score,
                    rank=1,
                    breakdown=MatchComponentBreakdown(
                        s_skill=round(s_skill, 2),
                        s_subject=round(s_subject, 2),
                        s_proficiency=round(s_proficiency, 2),
                        s_experience=round(s_experience, 2),
                        s_qualification=round(s_qualification, 2),
                    ),
                    matched_skills=matched_skills,
                    missing_skills=missing_skills,
                    explanation=explanation,
                )
            )

        # Sort descending by total score and assign ranks
        results.sort(key=lambda x: x.total_score, reverse=True)
        for i, item in enumerate(results, start=1):
            item.rank = i

        return CompetencyMatchResponse(
            requirement_id=req.id,
            requirement_title=req.title,
            total_candidates_evaluated=len(results),
            ranked_trainers=results,
        )
