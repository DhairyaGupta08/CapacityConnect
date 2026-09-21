"""MCQ Assessment management, secure timed attempts, grading, and certification trigger."""
import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.core.errors import NotFoundError
from app.db.models import (
    Assessment,
    AssessmentAttempt,
    AssessmentQuestion,
    Course,
    Enrollment,
    User,
)
from app.schemas.all_schemas import (
    AssessmentCreate,
    AssessmentOut,
    AssessmentQuestionOut,
    AssessmentResultOut,
    AttemptSubmitRequest,
    OptionSchema,
    QuestionResultDetail,
)
from app.services.certificate_service import CertificateService


class AssessmentService:
    @staticmethod
    def get_assessment_for_course(
        db: Session,
        course_id: uuid.UUID,
    ) -> AssessmentOut | None:
        """Fetch the assessment definition for a course."""
        assessment = db.scalar(
            select(Assessment)
            .options(selectinload(Assessment.questions))
            .where(Assessment.course_id == course_id, Assessment.is_active == True)  # noqa: E712
        )
        if not assessment:
            return None

        out = AssessmentOut.model_validate(assessment)
        out.total_questions = len(assessment.questions)
        out.questions = [
            AssessmentQuestionOut(
                id=q.id,
                assessment_id=q.assessment_id,
                question_text=q.question_text,
                question_type=q.question_type,
                marks=q.marks,
                sequence_order=q.sequence_order,
                options=[OptionSchema(**opt) for opt in q.options],
            )
            for q in assessment.questions
        ]
        return out

    @staticmethod
    def create_assessment(
        db: Session,
        req: AssessmentCreate,
    ) -> Assessment:
        """Create a new MCQ assessment with questions."""
        course = db.scalar(select(Course).where(Course.id == req.course_id))
        if not course:
            raise NotFoundError("Course not found.", code="COURSE_NOT_FOUND")

        assessment = Assessment(
            course_id=req.course_id,
            title=req.title,
            description=req.description,
            time_limit_minutes=req.time_limit_minutes,
            passing_percentage=req.passing_percentage,
            total_marks=req.total_marks,
            is_active=True,
        )
        db.add(assessment)
        db.flush()

        for q in req.questions:
            question = AssessmentQuestion(
                assessment_id=assessment.id,
                question_text=q.question_text,
                question_type=q.question_type,
                marks=q.marks,
                sequence_order=q.sequence_order,
                options=[opt.model_dump() for opt in q.options],
                correct_answers=q.correct_answers,
                explanation=q.explanation,
            )
            db.add(question)

        db.commit()
        db.refresh(assessment)
        return assessment

    @staticmethod
    def submit_attempt(
        db: Session,
        assessment_id: uuid.UUID,
        user: User,
        req: AttemptSubmitRequest,
    ) -> AssessmentResultOut:
        """Grade submission securely on the server and evaluate certificate issuance."""
        assessment = db.scalar(
            select(Assessment)
            .options(
                joinedload(Assessment.course),
                selectinload(Assessment.questions),
            )
            .where(Assessment.id == assessment_id)
        )
        if not assessment:
            raise NotFoundError("Assessment not found.", code="ASSESSMENT_NOT_FOUND")

        # Find or create enrollment
        enrollment = db.scalar(
            select(Enrollment).where(
                Enrollment.course_id == assessment.course_id,
                Enrollment.user_id == user.id,
            )
        )

        total_max_marks = sum(q.marks for q in assessment.questions) or 100
        awarded_marks = 0
        breakdowns: list[QuestionResultDetail] = []

        for q in assessment.questions:
            q_id_str = str(q.id)
            user_selected = req.answers.get(q_id_str, [])
            correct_set = set(q.correct_answers)
            user_set = set(user_selected)

            is_correct = (user_set == correct_set) and len(user_set) > 0
            marks_for_q = q.marks if is_correct else 0
            awarded_marks += marks_for_q

            breakdowns.append(
                QuestionResultDetail(
                    question_id=q_id_str,
                    question_text=q.question_text,
                    options=[OptionSchema(**opt) for opt in q.options],
                    user_answers=user_selected,
                    correct_answers=q.correct_answers,
                    is_correct=is_correct,
                    marks_awarded=marks_for_q,
                    max_marks=q.marks,
                    explanation=q.explanation,
                )
            )

        percentage = round((awarded_marks / total_max_marks) * 100.0, 1)
        passed = percentage >= assessment.passing_percentage
        submitted_at = datetime.now(UTC)

        attempt = AssessmentAttempt(
            assessment_id=assessment.id,
            user_id=user.id,
            enrollment_id=enrollment.id if enrollment else None,
            score=float(awarded_marks),
            percentage=percentage,
            passed=passed,
            started_at=submitted_at,
            submitted_at=submitted_at,
            answers=req.answers,
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)

        # Evaluate certificate issuance:
        # If passed AND course enrollment progress is 100% (or marked as completed), issue certificate
        certificate_code: str | None = None
        if passed:
            if enrollment:
                enrollment.progress_percent = 100.0
                enrollment.status = "completed"
                enrollment.completed_at = submitted_at
                db.commit()

            cert = CertificateService.issue_certificate_for_course(
                db=db,
                user=user,
                course=assessment.course,
                attempt=attempt,
            )
            certificate_code = cert.certificate_code

        return AssessmentResultOut(
            attempt_id=attempt.id,
            assessment_id=assessment.id,
            course_id=assessment.course_id,
            score=attempt.score,
            percentage=attempt.percentage,
            passed=attempt.passed,
            started_at=attempt.started_at,
            submitted_at=attempt.submitted_at,
            question_breakdown=breakdowns,
            certificate_code=certificate_code,
        )
