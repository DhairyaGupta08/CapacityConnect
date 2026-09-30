# Competency Matching Design

## Formula
```
Score = 100 × ( 0.40·S_skill + 0.20·S_subject + 0.15·S_proficiency + 0.15·S_experience + 0.10·S_qualification )
```

## Component Definitions
- **S_skill:** Coverage of required skills with importance weights (1–5). Direct match = 1.0, related skill = relation weight (e.g. 0.5), missing = 0.
- **S_subject:** 1.0 for exact subject match (scaled by level), 0.4 for category match, 0 otherwise.
- **S_proficiency:** Mean ratio of trainer proficiency to required target level.
- **S_experience:** Relevant years of experience / required years (clamped to 1.0).
- **S_qualification:** 1.0 for related qualification degree, 0.6 for adjacent degree, 0.3 for any degree.

## Explainability
The output provides:
1. Overall score (0–100)
2. Stacked component breakdown
3. Matched skills with levels
4. Missing skills
5. Human-readable explanation text
