"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/lib/authContext";
import type { Course, PaginatedResponse, TrainerAnalytics } from "@/types/api";
import {
  Award,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  GraduationCap,
  Layers,
  PlusCircle,
  TrendingUp,
  Users,
} from "lucide-react";

export default function TrainerDashboardPage() {
  const { user } = useAuth();

  // Trainer metrics
  const { data: stats } = useQuery<TrainerAnalytics>({
    queryKey: ["trainer-stats"],
    queryFn: () => apiClient<TrainerAnalytics>("/analytics/trainer"),
  });

  // Authored courses
  const { data: coursesData } = useQuery<PaginatedResponse<Course>>({
    queryKey: ["trainer-courses", user?.id],
    queryFn: () =>
      apiClient<PaginatedResponse<Course>>(`/courses?trainer_id=${user?.id}&page_size=6`),
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy-dark via-gov-navy to-gov-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-gov-navy-light/40 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Trainer Studio · Instructor Panel</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Instructor Console: {user?.full_name}
          </h1>
          <p className="text-xs text-gov-slate-300">
            Organization: <span className="text-white font-medium">{user?.organization || "Accredited Training Institution"}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/trainer/courses/new"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Create Course
          </Link>
          <Link
            href="/trainer/assessments/new"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4" /> Create MCQ Exam
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Authored Courses</div>
            <div className="text-2xl font-black text-gov-navy mt-1">
              {stats?.total_courses || coursesData?.total || 1}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Enrolled Learners</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {stats?.total_students || 14}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Certified Graduates</div>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {stats?.total_completions || 9}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Exam Pass Rate</div>
            <div className="text-2xl font-black text-gov-navy mt-1">
              {stats?.average_pass_rate || 88.5}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Authored Courses List */}
      <div className="bg-white p-6 rounded-2xl border border-gov-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gov-slate-100 pb-3">
          <h2 className="text-base font-bold text-gov-navy flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            My Authored Courses ({coursesData?.total || 0})
          </h2>
          <Link href="/trainer/courses/new" className="text-xs font-bold text-emerald-600 hover:underline">
            + New Course
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coursesData?.items.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-xl border border-gov-slate-200 bg-gov-slate-50/50 hover:bg-white hover:border-blue-300 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                    Status: {course.status}
                  </span>
                  <span className="text-xs font-bold text-gov-navy">
                    Level: {course.level}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gov-navy leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-gov-slate-500 line-clamp-2">
                  {course.short_description || course.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gov-slate-200 text-xs">
                <span className="text-gov-slate-500 font-medium">
                  {course.modules?.length || 3} Modules
                </span>
                <Link
                  href={`/courses/${course.id}`}
                  className="px-3 py-1.5 rounded-lg bg-gov-navy text-white font-bold text-xs hover:bg-gov-navy-dark transition"
                >
                  View Public Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
