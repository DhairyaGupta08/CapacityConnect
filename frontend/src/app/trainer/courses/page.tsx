"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/lib/authContext";
import type { Course, PaginatedResponse } from "@/types/api";
import { BookOpen, Clock, Edit, Eye, PlusCircle, Users } from "lucide-react";

export default function TrainerCoursesListPage() {
  const { user } = useAuth();

  const { data: coursesData, isLoading } = useQuery<PaginatedResponse<Course>>({
    queryKey: ["trainer-courses-all", user?.id],
    queryFn: () =>
      apiClient<PaginatedResponse<Course>>(`/courses?trainer_id=${user?.id}&page_size=20`),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gov-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
            My Authored Courses
          </h1>
          <p className="text-xs text-gov-slate-600">
            Manage your instructional content, update modules, and attach timed MCQ assessments.
          </p>
        </div>
        <Link
          href="/trainer/courses/new"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> Create New Course
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 bg-gov-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coursesData?.items.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-2xl border border-gov-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    {course.category_name || "Governance"}
                  </span>
                  <span className="text-xs font-bold text-gov-navy capitalize">
                    {course.level}
                  </span>
                </div>

                <h2 className="font-extrabold text-base text-gov-navy leading-snug">
                  {course.title}
                </h2>

                <p className="text-xs text-gov-slate-600 line-clamp-2 leading-relaxed">
                  {course.short_description || course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gov-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gov-navy" />
                    {course.estimated_hours} Hours
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-gov-navy" />
                    {course.modules?.length || 3} Modules
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-gov-slate-100">
                <Link
                  href={`/courses/${course.id}`}
                  className="px-3.5 py-1.5 rounded-lg border border-gov-slate-200 hover:bg-gov-slate-50 text-gov-navy font-bold text-xs transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </Link>
                <Link
                  href={`/trainer/assessments/new?course_id=${course.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm"
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
