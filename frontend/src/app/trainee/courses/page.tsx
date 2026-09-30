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
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#12355B] tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Track module completions, watch video lectures, and take official certification exams.
          </p>
        </div>
        <Link
          href="/courses"
          className="px-4 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
        >
          <GraduationCap className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 bg-[#E2E8F0]/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : courses?.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center space-y-4 shadow-[0_4px_20px_rgba(18,53,91,0.06)]">
          <BookOpen className="w-10 h-10 text-[#64748B]/50 mx-auto" />
          <h2 className="text-lg font-bold text-[#12355B]">You are not enrolled in any courses yet</h2>
          <p className="text-xs text-[#64748B]">Discover accredited courses in the public catalog and enroll for free.</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1769AA] text-white font-semibold text-xs shadow-sm hover:bg-[#12355B] transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses?.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] hover:border-[#1769AA]/40 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#DFF5F3] text-[#12355B] border border-[#00A6A6]/20 uppercase">
                    {course.category_name || "Governance"}
                  </span>
                  <span className="text-xs font-semibold text-[#12355B]">
                    {course.enrollment_progress || 0}% Complete
                  </span>
                </div>

                <h2 className="font-bold text-base text-[#12355B] leading-snug">
                  {course.title}
                </h2>

                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                  {course.short_description || course.description}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#1769AA] h-1.5 rounded-full transition-all"
                    style={{ width: `${course.enrollment_progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-[#E2E8F0] text-xs">
                <span className="text-[#64748B] font-medium">
                  {course.modules?.length || 3} Modules & Exam
                </span>
                <Link
                  href={`/trainee/courses/${course.id}/learn`}
                  className="px-4 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
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
