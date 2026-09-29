"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Course } from "@/types/api";
import { BookOpen, CheckCircle2, Clock, GraduationCap, Play } from "lucide-react";

export default function MyCoursesPage() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["my-enrolled-courses"],
    queryFn: () => apiClient<Course[]>("/courses/my-enrolled"),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gov-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-xs text-gov-slate-600">
            Track module completions, watch video lectures, and take official certification exams.
          </p>
        </div>
        <Link
          href="/courses"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
        >
          <GraduationCap className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 bg-gov-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : courses?.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gov-slate-200 text-center space-y-4">
          <BookOpen className="w-10 h-10 text-gov-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-gov-navy">You are not enrolled in any courses yet</h2>
          <p className="text-xs text-gov-slate-500">Discover accredited courses in the public catalog and enroll for free.</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-500"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses?.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-2xl border border-gov-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    {course.category_name || "Governance"}
                  </span>
                  <span className="text-xs font-bold text-gov-navy">
                    {course.enrollment_progress || 0}% Complete
                  </span>
                </div>

                <h2 className="font-extrabold text-base text-gov-navy leading-snug">
                  {course.title}
                </h2>

                <p className="text-xs text-gov-slate-600 line-clamp-2 leading-relaxed">
                  {course.short_description || course.description}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gov-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${course.enrollment_progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-gov-slate-100 text-xs">
                <span className="text-gov-slate-500 font-medium">
                  {course.modules?.length || 3} Modules & Exam
                </span>
                <Link
                  href={`/trainee/courses/${course.id}/learn`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Continue Player
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
