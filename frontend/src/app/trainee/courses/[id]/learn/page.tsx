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
        <div className="text-gov-navy font-bold text-sm animate-pulse">Loading course player environment...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-gov-navy">Course Not Found</h2>
        <Link href="/trainee/courses" className="text-xs text-emerald-600 font-bold">
          Back to My Courses
        </Link>
      </div>
    );
  }

  const isAllComplete = (course.enrollment_progress || 0) >= 99.0;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gov-slate-200 pb-4">
        <div className="space-y-1">
          <Link
            href="/trainee/courses"
            className="inline-flex items-center gap-1.5 text-xs text-gov-slate-500 hover:text-gov-navy font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Courses
          </Link>
          <h1 className="text-xl font-extrabold text-gov-navy leading-snug">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Indicator */}
          <div className="text-right">
            <div className="text-xs font-bold text-gov-navy">
              Course Progress: {course.enrollment_progress || 0}%
            </div>
            <div className="w-32 bg-gov-slate-200 rounded-full h-2 mt-1 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{ width: `${course.enrollment_progress || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Assessment Button */}
          <Link
            href={`/trainee/assessments/${course.id}`}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
          >
            <Award className="w-4 h-4" /> Take Assessment
          </Link>
        </div>
      </div>

      {/* Main Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Resource Viewer */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gov-slate-200 overflow-hidden shadow-sm space-y-4">
          {currentResource ? (
            <div>
              {/* Media Container */}
              {currentResource.resource_type === "video" ? (
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  <video
                    controls
                    className="w-full h-full object-contain"
                    src={currentResource.file_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                  >
                    Your browser does not support HTML5 video.
                  </video>
                </div>
              ) : currentResource.resource_type === "pdf" ? (
                <div className="p-8 bg-gov-slate-50 border-b border-gov-slate-200 text-center space-y-4">
                  <FileText className="w-16 h-16 text-rose-600 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-gov-navy">{currentResource.title}</h3>
                    <p className="text-xs text-gov-slate-500">Official Departmental Policy Guidelines (PDF Document)</p>
                  </div>
                  <a
                    href={currentResource.file_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Open / Download PDF Guide
                  </a>
                </div>
              ) : (
                <div className="p-6 bg-gov-slate-50 border-b border-gov-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <FileCheck className="w-5 h-5" />
                    <span>Official Training Notes & Directives</span>
                  </div>
                  <div className="text-xs text-gov-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-gov-slate-200">
                    {currentResource.content_text || "Lesson reading materials and compliance directives."}
                  </div>
                </div>
              )}

              {/* Lesson Details & Next Action */}
              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {activeItem.moduleTitle}
                    </div>
                    <h2 className="text-lg font-bold text-gov-navy">{currentResource.title}</h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gov-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{currentResource.duration_minutes} Minutes</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gov-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (activeResourceIndex > 0) {
                        setActiveResourceIndex(activeResourceIndex - 1);
                      }
                    }}
                    disabled={activeResourceIndex === 0}
                    className="px-3.5 py-2 rounded-lg border border-gov-slate-200 disabled:opacity-30 text-xs font-semibold text-gov-slate-700 hover:bg-gov-slate-50 transition flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  <button
                    onClick={() => progressMutation.mutate(currentResource.id)}
                    disabled={progressMutation.isPending}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {currentResource.is_completed ? "Completed (Proceed Next)" : "Mark Complete & Next"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gov-slate-500 text-xs">
              Select a lesson from the curriculum sidebar to begin.
            </div>
          )}
        </div>

        {/* Right Column: Module and Lesson Checklist */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gov-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-gov-slate-100 pb-3">
            <h3 className="font-bold text-sm text-gov-navy flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Curriculum Checklist
            </h3>
            <p className="text-[11px] text-gov-slate-500">Click any item to jump to that lesson.</p>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {course.modules?.map((mod, modIdx) => (
              <div key={mod.id} className="space-y-1.5">
                <div className="text-xs font-bold text-gov-navy px-2 py-1 bg-gov-slate-100 rounded flex items-center justify-between">
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
                            ? "bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold"
                            : "hover:bg-gov-slate-50 text-gov-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {res.is_completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-gov-slate-300 shrink-0" />
                          )}
                          <span className="truncate">{res.title}</span>
                        </div>
                        <span className="text-[10px] text-gov-slate-400 shrink-0 ml-1">{res.duration_minutes}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Assessment Card Callout */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Official Certification Exam</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-normal">
              15-Minute timed MCQ test. Scoring 70%+ automatically issues your verifiable digital certificate.
            </p>
            <Link
              href={`/trainee/assessments/${course.id}`}
              className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              Start Official MCQ Exam
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
