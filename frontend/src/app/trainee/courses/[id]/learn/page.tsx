"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Course, CourseResource } from "@/types/api";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileCheck,
  FileText,
  GraduationCap,
  Play,
  Video,
} from "lucide-react";

export default function CourseLearnPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ["course-player", courseId],
    queryFn: () => apiClient<Course>(`/courses/${courseId}`),
  });

  // Flat list of all resources across all modules
  const allResources: { resource: CourseResource; moduleTitle: string; index: number }[] = [];
  course?.modules?.forEach((m) => {
    m.resources?.forEach((r) => {
      allResources.push({
        resource: r,
        moduleTitle: m.title,
        index: allResources.length,
      });
    });
  });

  const [activeResourceIndex, setActiveResourceIndex] = useState(0);

  const activeItem = allResources[activeResourceIndex] || null;
  const currentResource = activeItem?.resource;

  // Mutation to mark resource progress
  const progressMutation = useMutation({
    mutationFn: (resId: string) =>
      apiClient(`/courses/resources/${resId}/progress`, {
        method: "POST",
        body: JSON.stringify({ completed: true, time_spent_seconds: 120 }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-player", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-enrolled-courses"] });
      // Proceed to next resource if available
      if (activeResourceIndex < allResources.length - 1) {
        setActiveResourceIndex(activeResourceIndex + 1);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-[#1769AA] border-t-transparent animate-spin"></div>
          <div className="text-[#12355B] font-semibold text-sm">Loading course player environment...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-[#12355B]">Course Not Found</h2>
        <Link href="/trainee/courses" className="text-xs text-[#1769AA] font-semibold hover:underline">
          Back to My Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div className="space-y-1">
          <Link
            href="/trainee/courses"
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#12355B] font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Courses
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-[#12355B] leading-snug">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Indicator */}
          <div className="text-right">
            <div className="text-xs font-semibold text-[#12355B]">
              Course Progress: {course.enrollment_progress || 0}%
            </div>
            <div className="w-32 bg-[#E2E8F0] rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-[#1769AA] h-1.5 rounded-full transition-all"
                style={{ width: `${course.enrollment_progress || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Assessment Button */}
          <Link
            href={`/trainee/assessments/${course.id}`}
            className="px-4 py-2 rounded-lg bg-[#D89B18] hover:bg-[#B78212] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5 shrink-0"
          >
            <Award className="w-4 h-4" /> Take Assessment
          </Link>
        </div>
      </div>

      {/* Main Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Resource Viewer */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4">
          {currentResource ? (
            <div>
              {/* Media Container */}
              {currentResource.resource_type === "video" ? (
                <div className="relative aspect-video bg-[#12355B] flex items-center justify-center">
                  <video
                    controls
                    className="w-full h-full object-contain"
                    src={currentResource.file_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                  >
                    Your browser does not support HTML5 video.
                  </video>
                </div>
              ) : currentResource.resource_type === "pdf" ? (
                <div className="p-8 bg-[#F7F9FC] border-b border-[#E2E8F0] text-center space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-[#FDF2F2] border border-[#D64545]/20 flex items-center justify-center mx-auto text-[#D64545]">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-[#12355B]">{currentResource.title}</h3>
                    <p className="text-xs text-[#64748B]">Official Departmental Policy Guidelines (PDF Document)</p>
                  </div>
                  <a
                    href={currentResource.file_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1769AA] text-white font-semibold text-xs hover:bg-[#12355B] transition shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Open / Download PDF Guide
                  </a>
                </div>
              ) : (
                <div className="p-6 bg-[#F7F9FC] border-b border-[#E2E8F0] space-y-4">
                  <div className="flex items-center gap-2 text-[#12355B] font-bold text-sm">
                    <FileCheck className="w-5 h-5 text-[#00A6A6]" />
                    <span>Official Training Notes & Directives</span>
                  </div>
                  <div className="text-xs text-[#172B4D] leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-[#E2E8F0]">
                    {currentResource.content_text || "Lesson reading materials and compliance directives."}
                  </div>
                </div>
              )}

              {/* Lesson Details & Next Action */}
              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#00A6A6]">
                      {activeItem.moduleTitle}
                    </div>
                    <h2 className="text-lg font-bold text-[#12355B]">{currentResource.title}</h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <Clock className="w-3.5 h-3.5 text-[#1769AA]" />
                    <span>{currentResource.duration_minutes} Minutes</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (activeResourceIndex > 0) {
                        setActiveResourceIndex(activeResourceIndex - 1);
                      }
                    }}
                    disabled={activeResourceIndex === 0}
                    className="px-3.5 py-2 rounded-lg border border-[#E2E8F0] disabled:opacity-30 text-xs font-semibold text-[#172B4D] hover:bg-[#F7F9FC] transition flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  <button
                    onClick={() => progressMutation.mutate(currentResource.id)}
                    disabled={progressMutation.isPending}
                    className="px-5 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {currentResource.is_completed ? "Completed (Proceed Next)" : "Mark Complete & Next"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#64748B] text-xs">
              Select a lesson from the curriculum sidebar to begin.
            </div>
          )}
        </div>

        {/* Right Column: Module and Lesson Checklist */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="font-bold text-sm text-[#12355B] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#1769AA]" />
              Curriculum Checklist
            </h3>
            <p className="text-[11px] text-[#64748B]">Click any item to jump to that lesson.</p>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {course.modules?.map((mod, modIdx) => (
              <div key={mod.id} className="space-y-1.5">
                <div className="text-xs font-semibold text-[#12355B] px-2 py-1 bg-[#F7F9FC] border border-[#E2E8F0] rounded flex items-center justify-between">
                  <span>Module {modIdx + 1}: {mod.title}</span>
                </div>

                <div className="space-y-1 pl-1">
                  {mod.resources?.map((res) => {
                    const itemGlobalIndex = allResources.findIndex((item) => item.resource.id === res.id);
                    const isSelected = itemGlobalIndex === activeResourceIndex;

                    return (
                      <button
                        key={res.id}
                        onClick={() => setActiveResourceIndex(itemGlobalIndex)}
                        className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition ${
                          isSelected
                            ? "bg-[#DFF5F3] border border-[#00A6A6]/40 text-[#12355B] font-semibold"
                            : "hover:bg-[#F7F9FC] text-[#172B4D]"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {res.is_completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#16875D] shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#64748B]/40 shrink-0" />
                          )}
                          <span className="truncate">{res.title}</span>
                        </div>
                        <span className="text-[10px] text-[#64748B] shrink-0 ml-1">{res.duration_minutes}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Assessment Card Callout */}
          <div className="p-4 rounded-xl bg-[#FEF8E7] border border-[#D89B18]/30 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-[#12355B]">
              <Award className="w-4 h-4 text-[#D89B18]" />
              <span>Official Certification Exam</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-normal">
              15-Minute timed MCQ test. Scoring 70%+ automatically issues your verifiable digital certificate.
            </p>
            <Link
              href={`/trainee/assessments/${course.id}`}
              className="w-full py-2 rounded-lg bg-[#D89B18] hover:bg-[#B78212] text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              Start Official MCQ Exam
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
