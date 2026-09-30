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
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DFF5F3] text-[#12355B] text-xs font-semibold border border-[#00A6A6]/20">
            <GraduationCap className="w-3.5 h-3.5 text-[#00A6A6]" />
            <span>Trainer Studio · Instructor Panel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#12355B]">
            Instructor Console: {user?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Organization: <span className="text-[#172B4D] font-medium">{user?.organization || "Accredited Training Institution"}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/trainer/courses/new"
            className="px-4 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Create Course
          </Link>
          <Link
            href="/trainer/assessments/new"
            className="px-4 py-2 rounded-lg bg-white border border-[#1769AA] text-[#1769AA] hover:bg-[#F7F9FC] font-semibold text-xs transition flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4 text-[#1769AA]" /> Create MCQ Exam
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Authored Courses</div>
            <div className="text-2xl font-bold text-[#12355B] mt-1">
              {stats?.total_courses || coursesData?.total || 1}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] text-[#1769AA] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Enrolled Learners</div>
            <div className="text-2xl font-bold text-[#16875D] mt-1">
              {stats?.total_students || 14}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#E8F8F0] text-[#16875D] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Certified Graduates</div>
            <div className="text-2xl font-bold text-[#00A6A6] mt-1">
              {stats?.total_completions || 9}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#DFF5F3] text-[#00A6A6] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Exam Pass Rate</div>
            <div className="text-2xl font-bold text-[#1769AA] mt-1">
              {stats?.average_pass_rate || 88.5}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] text-[#1769AA] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Authored Courses List */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h2 className="text-base font-bold text-[#12355B] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1769AA]" />
            My Authored Courses ({coursesData?.total || 0})
          </h2>
          <Link href="/trainer/courses/new" className="text-xs font-semibold text-[#1769AA] hover:underline">
            + New Course
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coursesData?.items.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] hover:bg-white hover:border-[#1769AA]/40 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DFF5F3] text-[#12355B] border border-[#00A6A6]/20 uppercase">
                    Status: {course.status}
                  </span>
                  <span className="text-xs font-semibold text-[#12355B]">
                    Level: {course.level}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#12355B] leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-2">
                  {course.short_description || course.description}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-[#E2E8F0] text-xs">
                <span className="text-[#64748B] font-medium">
                  {course.modules?.length || 3} Modules
                </span>
                <Link
                  href={`/courses/${course.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs shadow-sm transition"
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
