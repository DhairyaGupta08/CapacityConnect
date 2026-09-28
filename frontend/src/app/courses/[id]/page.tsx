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
        <div className="animate-pulse text-gov-navy font-bold text-sm">Loading course curriculum...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 max-w-7xl mx-auto p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-gov-navy">Course Not Found</h2>
        <Link href="/courses" className="text-xs font-bold text-emerald-600 hover:underline">
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
    <div className="flex-1 bg-gov-slate-50 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy-dark via-gov-navy to-gov-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-gov-navy-light/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-gov-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              {course.category_name || "Governance"}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gov-navy text-gov-slate-200 border border-gov-slate-700 capitalize">
              Level: {course.level}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight max-w-3xl">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-gov-slate-300 max-w-3xl leading-relaxed">
            {course.short_description || course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-gov-slate-300 pt-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{course.estimated_hours} Hours Total Duration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>{course.modules?.length || 3} Curriculum Modules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
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
          <div className="bg-white p-6 rounded-xl border border-gov-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-gov-navy border-b border-gov-slate-100 pb-2">
              Course Curriculum & Scope
            </h2>
            <p className="text-xs sm:text-sm text-gov-slate-700 leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* Modules Accordion Tree */}
          <div className="bg-white p-6 rounded-xl border border-gov-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gov-slate-100 pb-3">
              <h2 className="text-base font-bold text-gov-navy">
                Module Breakdown ({course.modules?.length || 0})
              </h2>
              <span className="text-xs text-gov-slate-500 font-medium">
                Pass MCQ Exam to Receive Certificate
              </span>
            </div>

            <div className="space-y-4">
              {course.modules?.map((mod, idx) => (
                <div key={mod.id} className="border border-gov-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-gov-slate-50 px-4 py-3 border-b border-gov-slate-200 flex items-center justify-between">
                    <div className="font-bold text-xs sm:text-sm text-gov-navy flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-gov-navy text-white text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{mod.title}</span>
                    </div>
                    <span className="text-xs text-gov-slate-500">{mod.duration_minutes} mins</span>
                  </div>

                  {mod.description && (
                    <div className="px-4 py-2 text-xs text-gov-slate-600 bg-white border-b border-gov-slate-100">
                      {mod.description}
                    </div>
                  )}

                  <div className="divide-y divide-gov-slate-100 bg-white">
                    {mod.resources?.map((res) => (
                      <div key={res.id} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-gov-slate-50 transition">
                        <div className="flex items-center gap-2.5 text-gov-slate-800">
                          {res.resource_type === "video" ? (
                            <Video className="w-4 h-4 text-blue-600 shrink-0" />
                          ) : res.resource_type === "pdf" ? (
                            <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                          ) : (
                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          <span className="font-medium">{res.title}</span>
                        </div>
                        <span className="text-gov-slate-400 text-[11px]">{res.duration_minutes}m</span>
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
          <div className="bg-white p-6 rounded-2xl border border-gov-slate-200 shadow-md space-y-5 sticky top-24">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                Certified Institutional Program
              </span>
              <div className="text-2xl font-black text-gov-navy">
                Government Free Access
              </div>
              <p className="text-xs text-gov-slate-500">
                Funded under National Capacity Building Directives for institutional personnel.
              </p>
            </div>

            {course.is_enrolled && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-emerald-900">
                  <span>Your Current Progress</span>
                  <span>{course.enrollment_progress || 0}%</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${course.enrollment_progress || 0}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleEnrollOrResume}
              disabled={enrollMutation.isPending}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg hover:shadow-emerald-600/30 transition flex items-center justify-center gap-2"
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

            <div className="border-t border-gov-slate-100 pt-4 space-y-2.5 text-xs text-gov-slate-600">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Includes High-Quality Video Lectures</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Departmental Policy Guidelines (PDF)</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Timed 15-Minute MCQ Exam</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Publicly Verifiable QR Certificate</span>
              </div>
            </div>

            {/* Instructor Bio */}
            <div className="border-t border-gov-slate-100 pt-4 space-y-2">
              <div className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Course Instructor
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gov-navy text-white font-bold flex items-center justify-center text-sm shadow">
                  {course.trainer_name ? course.trainer_name.charAt(0) : "I"}
                </div>
                <div>
                  <div className="font-bold text-xs text-gov-navy">{course.trainer_name || "Lead Instructor"}</div>
                  <div className="text-[11px] text-gov-slate-500">Accredited Subject Matter Expert</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
