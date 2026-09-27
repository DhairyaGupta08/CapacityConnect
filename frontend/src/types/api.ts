import type { Role, UserStatus } from "./enums";

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface HealthResponse {
  status: string;
  app: string;
  version: string;
  database: string;
  environment: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "trainer" | "trainee";
  status: "active" | "pending" | "rejected" | "suspended";
  phone?: string;
  organization?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface TraineeProfile {
  id: string;
  user_id: string;
  department?: string;
  designation?: string;
  employee_id?: string;
  qualifications: Array<{ degree: string; institution: string; year?: number }>;
  experience_years: number;
  skills: Array<{ name: string; level: number; category?: string }>;
  interests: string[];
  resume_url?: string;
}

export interface TrainerProfile {
  id: string;
  user_id: string;
  expertise_subjects: string[];
  skills: Array<{ name: string; level: number; years?: number }>;
  qualifications: Array<{ degree: string; institution: string; year?: number }>;
  experience_years: number;
  hourly_rate?: number;
  availability_status: boolean;
  approval_notes?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category_id?: string;
  description?: string;
}

export interface CourseResource {
  id: string;
  module_id: string;
  title: string;
  resource_type: "video" | "pdf" | "document" | "text";
  file_url?: string;
  content_text?: string;
  duration_minutes: number;
  sequence_order: number;
  is_downloadable: boolean;
  is_completed?: boolean;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  sequence_order: number;
  duration_minutes: number;
  resources: CourseResource[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  category_id?: string;
  category_name?: string;
  trainer_id: string;
  trainer_name?: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published" | "archived";
  thumbnail_url?: string;
  estimated_hours: number;
  total_enrollments: number;
  modules: CourseModule[];
  is_enrolled?: boolean;
  enrollment_progress?: number;
  created_at: string;
  updated_at?: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: "enrolled" | "in_progress" | "completed" | "dropped";
  progress_percent: number;
  started_at: string;
  completed_at?: string;
  course?: Course;
}

export interface AssessmentQuestionOption {
  id: string;
  text: string;
}

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: "single_choice" | "multiple_choice";
  marks: number;
  sequence_order: number;
  options: AssessmentQuestionOption[];
}

export interface Assessment {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  time_limit_minutes: number;
  passing_percentage: number;
  total_marks: number;
  is_active: boolean;
  total_questions: number;
  questions: AssessmentQuestion[];
}

export interface QuestionResultDetail {
  question_id: string;
  question_text: string;
  options: AssessmentQuestionOption[];
  user_answers: string[];
  correct_answers: string[];
  is_correct: boolean;
  marks_awarded: number;
  max_marks: number;
  explanation?: string;
}

export interface AssessmentResult {
  attempt_id: string;
  assessment_id: string;
  course_id: string;
  score: number;
  percentage: number;
  passed: boolean;
  started_at: string;
  submitted_at: string;
  question_breakdown: QuestionResultDetail[];
  certificate_code?: string;
}

export interface Certificate {
  id: string;
  certificate_code: string;
  user_id: string;
  recipient_name?: string;
  course_id: string;
  course_title?: string;
  issue_date: string;
  pdf_url?: string;
  status: "issued" | "revoked";
  verification_qr_data?: string;
  metadata_snapshot?: Record<string, any>;
}

export interface PublicVerification {
  is_valid: boolean;
  certificate_code: string;
  recipient_name: string;
  course_title: string;
  issue_date: string;
  status: string;
  organization: string;
  score_percentage?: number;
  pdf_url?: string;
}

export interface SkillRequirement {
  name: string;
  min_level: number;
  weight: number;
}

export interface CompetencyRequirement {
  id: string;
  title: string;
  description?: string;
  target_role: string;
  department?: string;
  required_skills: SkillRequirement[];
  required_subjects: string[];
  min_experience_years: number;
  min_qualification: string;
  created_at: string;
}

export interface MatchComponentBreakdown {
  s_skill: number;
  s_subject: number;
  s_proficiency: number;
  s_experience: number;
  s_qualification: number;
}

export interface TrainerMatchResult {
  trainer_id: string;
  trainer_name: string;
  email: string;
  organization?: string;
  experience_years: number;
  total_score: number;
  rank: number;
  breakdown: MatchComponentBreakdown;
  matched_skills: string[];
  missing_skills: string[];
  explanation: string;
}

export interface CompetencyMatchResponse {
  requirement_id: string;
  requirement_title: string;
  total_candidates_evaluated: number;
  ranked_trainers: TrainerMatchResult[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  notification_type: "info" | "success" | "warning" | "action";
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_role: "all" | "trainee" | "trainer" | "admin";
  created_by_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminAnalytics {
  total_users: number;
  total_trainees: number;
  total_trainers: number;
  pending_approvals: number;
  total_courses: number;
  total_enrollments: number;
  total_completions: number;
  total_certificates_issued: number;
  average_assessment_score: number;
  monthly_enrollments: Array<{ month: string; enrollments: number; completions: number }>;
  category_distribution: Array<{ name: string; value: number }>;
}

export interface TrainerAnalytics {
  total_courses: number;
  total_students: number;
  total_completions: number;
  average_pass_rate: number;
  recent_attempts: any[];
}

export interface TraineeAnalytics {
  enrolled_courses_count: number;
  completed_courses_count: number;
  in_progress_count: number;
  certificates_earned_count: number;
  average_score: number;
  total_learning_hours: number;
}
