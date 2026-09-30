"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/lib/authContext";
import type { Course, PaginatedResponse } from "@/types/api";
import { BookOpen, Clock, Eye, PlusCircle } from "lucide-react";

export default function TrainerCoursesListPage() {
  const { user } = useAuth();

  const { data: coursesData, isLoading } = useQuery<PaginatedResponse<Course>>({
    queryKey: ["trainer-courses-all", user?.id],
    queryFn: () =>
      apiClient<PaginatedResponse<Course>>(`/courses?trainer_id=${user?.id}&page_size=20`),
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#12355B] tracking-tight">
            My Authored Courses
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage instructional content, syllabus modules, and timed certification assessments.
          </p>
        </div>
        <Link
          href="/trainer/courses/new"
          className="px-4 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> Create New Course
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 bg-[#E2E8F0]/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coursesData?.items.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] hover:border-[#1769AA]/40 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#DFF5F3] text-[#12355B] border border-[#00A6A6]/20 uppercase">
                    {course.category_name || "Governance"}
                  </span>
                  <span className="text-xs font-semibold text-[#12355B] capitalize">
                    {course.level}
                  </span>
                </div>

                <h2 className="font-bold text-base text-[#12355B] leading-snug">
                  {course.title}
                </h2>

                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                  {course.short_description || course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-[#64748B] pt-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#1769AA]" />
                    {course.estimated_hours} Hours
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#1769AA]" />
                    {course.modules?.length || 3} Modules
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-[#E2E8F0]">
                <Link
                  href={`/courses/${course.id}`}
                  className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F7F9FC] text-[#12355B] font-semibold text-xs transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </Link>
                <Link
                  href={`/trainer/assessments/new?course_id=${course.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs transition shadow-sm"
                >
                  Add MCQ Exam
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
