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
  FileCheck,
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gov-navy-dark via-gov-navy to-gov-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-gov-navy-light/40 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learner Portal · Active Session</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.full_name}
          </h1>
          <p className="text-xs text-gov-slate-300">
            Department: <span className="text-white font-medium">{user?.organization || "Government Directorate"}</span>
          </p>
        </div>
        <Link
          href="/courses"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
        >
          <GraduationCap className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Enrolled Courses</div>
            <div className="text-2xl font-black text-gov-navy mt-1">
              {stats?.enrolled_courses_count || myCourses?.length || 1}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Completed Courses</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {stats?.completed_courses_count || 1}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Certificates Earned</div>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {stats?.certificates_earned_count || certificates?.length || 1}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Learning Hours</div>
            <div className="text-2xl font-black text-gov-navy mt-1">
              {stats?.total_learning_hours || 4.5}h
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* In Progress Courses */}
      <div className="bg-white p-6 rounded-2xl border border-gov-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gov-slate-100 pb-3">
          <h2 className="text-base font-bold text-gov-navy flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            My Active Learning Courses ({myCourses?.length || 0})
          </h2>
          <Link href="/courses" className="text-xs font-bold text-emerald-600 hover:underline">
            Explore More
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCourses?.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-xl border border-gov-slate-200 hover:border-emerald-300 bg-gov-slate-50/60 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    {course.category_name || "Governance"}
                  </span>
                  <span className="text-xs font-bold text-gov-navy">
                    {course.enrollment_progress || 0}% Complete
                  </span>
                </div>

                <h3 className="font-bold text-sm text-gov-navy leading-snug">
                  {course.title}
                </h3>

                {/* Progress bar */}
                <div className="w-full bg-gov-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${course.enrollment_progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gov-slate-200">
                <span className="text-[11px] text-gov-slate-500">
                  {course.modules?.length || 3} Modules & Assessment
                </span>
                <Link
                  href={`/trainee/courses/${course.id}/learn`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1"
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
        <div className="bg-white p-6 rounded-2xl border border-gov-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gov-slate-100 pb-3">
            <h2 className="text-base font-bold text-gov-navy flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Earned Certifications ({certificates.length})
            </h2>
            <Link href="/trainee/certificates" className="text-xs font-bold text-emerald-600 hover:underline">
              View All Certificates
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="text-[11px] font-mono font-bold text-amber-900 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" /> {c.certificate_code}
                  </div>
                  <div className="text-xs font-bold text-gov-navy">{c.course_title}</div>
                  <div className="text-[10px] text-gov-slate-500">
                    Issued: {new Date(c.issue_date).toLocaleDateString()}
                  </div>
                </div>
                <Link
                  href={`/verify/${c.certificate_code}`}
                  className="px-3 py-1.5 rounded-lg bg-gov-navy text-white text-xs font-bold hover:bg-gov-navy-dark transition"
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
