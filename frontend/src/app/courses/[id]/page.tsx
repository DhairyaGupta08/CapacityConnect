"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/lib/authContext";
import type { Course } from "@/types/api";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  GraduationCap,
  Play,
  Shield,
  Users,
  Video,
} from "lucide-react";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: () => apiClient<Course>(`/courses/${courseId}`),
  });

  const enrollMutation = useMutation({
    mutationFn: () => apiClient(`/courses/${courseId}/enroll`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      router.push(`/trainee/courses/${courseId}/learn`);
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto p-8 flex items-center justify-center">
        <div className="text-[#12355B] font-bold text-sm animate-pulse">Loading course curriculum...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 max-w-7xl mx-auto p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#12355B]">Course Not Found</h2>
        <Link href="/courses" className="text-xs font-bold text-[#1769AA] hover:underline">
          Return to Course Catalog
        </Link>
      </div>
    );
  }

  const handleEnrollOrResume = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (course.is_enrolled) {
      router.push(`/trainee/courses/${courseId}/learn`);
    } else {
      enrollMutation.mutate();
    }
  };

  return (
    <div className="flex-1 bg-[#F7F9FC] pb-16">
      {/* Header Banner */}
      <div className="bg-[#12355B] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#1D4B7D]">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#DFF5F3] text-[#12355B]">
              {course.category_name || "Governance"}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#1D4B7D] text-slate-200 capitalize">
              Level: {course.level}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight max-w-3xl leading-tight">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {course.short_description || course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#00A6A6]" />
              <span>{course.estimated_hours} Hours Total Duration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#00A6A6]" />
              <span>{course.modules?.length || 3} Curriculum Modules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D89B18]" />
              <span>Certified Digital Credential</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Curriculum tree & description */}
        <div className="lg:col-span-8 space-y-8">
          {/* Detailed Overview */}
          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h2 className="text-base font-bold text-[#12355B] border-b border-[#E2E8F0] pb-2">
              Course Curriculum & Scope
            </h2>
            <p className="text-xs sm:text-sm text-[#172B4D] leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* Modules Accordion Tree */}
          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h2 className="text-base font-bold text-[#12355B]">
                Module Breakdown ({course.modules?.length || 0})
              </h2>
              <span className="text-xs text-[#64748B] font-medium">
                Pass MCQ Exam to Receive Certificate
              </span>
            </div>

            <div className="space-y-4">
              {course.modules?.map((mod, idx) => (
                <div key={mod.id} className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                  <div className="bg-[#F7F9FC] px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
                    <div className="font-bold text-xs sm:text-sm text-[#12355B] flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[#12355B] text-white text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{mod.title}</span>
                    </div>
                    <span className="text-xs text-[#64748B]">{mod.duration_minutes} mins</span>
                  </div>

                  {mod.description && (
                    <div className="px-4 py-2 text-xs text-[#64748B] bg-white border-b border-[#E2E8F0]">
                      {mod.description}
                    </div>
                  )}

                  <div className="divide-y divide-[#E2E8F0] bg-white">
                    {mod.resources?.map((res) => (
                      <div key={res.id} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-[#F7F9FC] transition">
                        <div className="flex items-center gap-2.5 text-[#172B4D]">
                          {res.resource_type === "video" ? (
                            <Video className="w-4 h-4 text-[#1769AA] shrink-0" />
                          ) : res.resource_type === "pdf" ? (
                            <FileText className="w-4 h-4 text-[#D64545] shrink-0" />
                          ) : (
                            <FileCheck className="w-4 h-4 text-[#16875D] shrink-0" />
                          )}
                          <span className="font-medium">{res.title}</span>
                        </div>
                        <span className="text-[#64748B] text-[11px]">{res.duration_minutes}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Enrollment Card & Instructor Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-card space-y-5 sticky top-24">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#16875D] bg-[#E8F8F0] px-2 py-0.5 rounded uppercase tracking-wider">
                Certified Institutional Program
              </span>
              <div className="text-2xl font-bold text-[#12355B]">
                Government Free Access
              </div>
              <p className="text-xs text-[#64748B]">
                Funded under National Capacity Building Directives for institutional personnel.
              </p>
            </div>

            {course.is_enrolled && (
              <div className="p-3 rounded-lg bg-[#EBF3FB] border border-[#1769AA]/30 text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#12355B]">
                  <span>Your Current Progress</span>
                  <span>{course.enrollment_progress || 0}%</span>
                </div>
                <div className="w-full bg-[#CBD5E1] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#1769AA] h-2 rounded-full transition-all"
                    style={{ width: `${course.enrollment_progress || 0}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleEnrollOrResume}
              disabled={enrollMutation.isPending}
              className="w-full py-3 rounded-lg bg-[#1769AA] hover:bg-[#135488] disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              {course.is_enrolled ? (
                <>
                  <Play className="w-4 h-4 fill-white" /> Resume Learning Player
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4" /> Enroll in Course
                </>
              )}
            </button>

            <div className="border-t border-[#E2E8F0] pt-4 space-y-2.5 text-xs text-[#64748B]">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16875D]" />
                <span className="text-[#172B4D]">Includes High-Quality Video Lectures</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16875D]" />
                <span className="text-[#172B4D]">Departmental Policy Guidelines (PDF)</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16875D]" />
                <span className="text-[#172B4D]">Timed 15-Minute MCQ Exam</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16875D]" />
                <span className="text-[#172B4D]">Publicly Verifiable QR Certificate</span>
              </div>
            </div>

            {/* Instructor Bio */}
            <div className="border-t border-[#E2E8F0] pt-4 space-y-2">
              <div className="text-xs font-bold text-[#12355B] uppercase tracking-wider">
                Course Instructor
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#12355B] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {course.trainer_name ? course.trainer_name.charAt(0) : "I"}
                </div>
                <div>
                  <div className="font-bold text-xs text-[#12355B]">{course.trainer_name || "Lead Instructor"}</div>
                  <div className="text-[11px] text-[#64748B]">Accredited Subject Matter Expert</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

