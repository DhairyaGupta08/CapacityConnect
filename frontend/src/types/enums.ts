export type Role = "trainee" | "trainer" | "admin";

export type UserStatus = "pending" | "active" | "rejected" | "suspended";

export type CourseStatus = "draft" | "pending_review" | "published" | "archived";

export type EnrollmentStatus = "enrolled" | "in_progress" | "completed" | "dropped";

export type AttemptStatus = "in_progress" | "submitted";

export type CertificateStatus = "issued" | "revoked";

export type ResourceType = "pdf" | "ppt" | "doc" | "video" | "link" | "other";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type AudienceType = "all" | "trainees" | "trainers" | "course";

export type DocumentKind = "certificate" | "id" | "other";
