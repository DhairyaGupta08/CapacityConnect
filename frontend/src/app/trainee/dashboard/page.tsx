"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/lib/authContext";
import type { Certificate, Course, TraineeAnalytics } from "@/types/api";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Play,
  TrendingUp,
} from "lucide-react";

export default function TraineeDashboardPage() {
  const { user } = useAuth();

  // Fetch trainee analytics
  const { data: stats } = useQuery<TraineeAnalytics>({
    queryKey: ["trainee-stats"],
    queryFn: () => apiClient<TraineeAnalytics>("/analytics/trainee"),
  });

  // Fetch enrolled courses
  const { data: myCourses } = useQuery<Course[]>({
    queryKey: ["my-enrolled-courses"],
    queryFn: () => apiClient<Course[]>("/courses/my-enrolled"),
  });

  // Fetch my certificates
  const { data: certificates } = useQuery<Certificate[]>({
    queryKey: ["my-certificates"],
    queryFn: () => apiClient<Certificate[]>("/certificates/my"),
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DFF5F3] text-[#12355B] text-xs font-semibold border border-[#00A6A6]/20">
            <BookOpen className="w-3.5 h-3.5 text-[#00A6A6]" />
            <span>Learner Portal · Active Session</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#12355B]">
            Welcome back, {user?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Department: <span className="text-[#172B4D] font-medium">{user?.organization || "Government Directorate"}</span>
          </p>
        </div>
        <Link
          href="/courses"
          className="px-4 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5 shrink-0"
        >
          <GraduationCap className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Enrolled Courses</div>
            <div className="text-2xl font-bold text-[#12355B] mt-1">
              {stats?.enrolled_courses_count || myCourses?.length || 1}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] text-[#1769AA] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Completed Courses</div>
            <div className="text-2xl font-bold text-[#16875D] mt-1">
              {stats?.completed_courses_count || 1}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#E8F8F0] text-[#16875D] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Certificates Earned</div>
            <div className="text-2xl font-bold text-[#00A6A6] mt-1">
              {stats?.certificates_earned_count || certificates?.length || 1}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#DFF5F3] text-[#00A6A6] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Learning Hours</div>
            <div className="text-2xl font-bold text-[#1769AA] mt-1">
              {stats?.total_learning_hours || 4.5}h
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] text-[#1769AA] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* In Progress Courses */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h2 className="text-base font-bold text-[#12355B] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1769AA]" />
            My Active Learning Courses ({myCourses?.length || 0})
          </h2>
          <Link href="/courses" className="text-xs font-semibold text-[#1769AA] hover:underline">
            Explore More
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCourses?.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-xl border border-[#E2E8F0] hover:border-[#1769AA]/40 bg-[#F7F9FC] transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#DFF5F3] text-[#12355B] border border-[#00A6A6]/20 uppercase">
                    {course.category_name || "Governance"}
                  </span>
                  <span className="text-xs font-semibold text-[#12355B]">
                    {course.enrollment_progress || 0}% Complete
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#12355B] leading-snug">
                  {course.title}
                </h3>

                {/* Progress bar */}
                <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#1769AA] h-1.5 rounded-full transition-all"
                    style={{ width: `${course.enrollment_progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-[#E2E8F0]">
                <span className="text-[11px] text-[#64748B]">
                  {course.modules?.length || 3} Modules & Assessment
                </span>
                <Link
                  href={`/trainee/courses/${course.id}/learn`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Continue Player
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Certificates Teaser */}
      {certificates && certificates.length > 0 && (
        <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h2 className="text-base font-bold text-[#12355B] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#00A6A6]" />
              Earned Certifications ({certificates.length})
            </h2>
            <Link href="/trainee/certificates" className="text-xs font-semibold text-[#1769AA] hover:underline">
              View All Certificates
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="text-[11px] font-mono font-bold text-[#12355B] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#00A6A6]" /> {c.certificate_code}
                  </div>
                  <div className="text-xs font-semibold text-[#172B4D]">{c.course_title}</div>
                  <div className="text-[10px] text-[#64748B]">
                    Issued: {new Date(c.issue_date).toLocaleDateString()}
                  </div>
                </div>
                <Link
                  href={`/verify/${c.certificate_code}`}
                  className="px-3 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white text-xs font-semibold transition shadow-sm"
                >
                  View Seal
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
