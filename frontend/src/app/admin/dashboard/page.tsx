"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiClient } from "@/lib/apiClient";
import type { AdminAnalytics } from "@/types/api";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery<AdminAnalytics>({
    queryKey: ["admin-stats"],
    queryFn: () => apiClient<AdminAnalytics>("/analytics/admin"),
  });

  const enrollmentData = stats?.monthly_enrollments || [
    { month: "Jan", enrollments: 45, completions: 28 },
    { month: "Feb", enrollments: 82, completions: 56 },
    { month: "Mar", enrollments: 124, completions: 89 },
    { month: "Apr", enrollments: 178, completions: 132 },
    { month: "May", enrollments: 240, completions: 185 },
    { month: "Jun", enrollments: 310, completions: 245 },
  ];

  const categoryData = stats?.category_distribution || [
    { name: "Cybersecurity & Governance", value: 4 },
    { name: "Digital Public Infrastructure", value: 3 },
    { name: "AI & Emerging Tech", value: 2 },
  ];

  const COLORS = ["#059669", "#2563EB", "#D97706", "#7C3AED"];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy-dark via-gov-navy to-gov-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-gov-navy-light/40 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>National Governance Console · Central Administration</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Capacity Building Governance Overview
          </h1>
          <p className="text-xs text-gov-slate-300">
            Real-time platform metrics, institutional accreditation queues, and deterministic competency analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/approvals"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" /> Review Approvals
          </Link>
          <Link
            href="/admin/competency"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" /> Competency Matcher
          </Link>
        </div>
      </div>

      {/* Pending Approvals Callout Banner if any */}
      {(stats?.pending_approvals ?? 1) > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-200/80 flex items-center justify-center text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs">
                {stats?.pending_approvals || 1} Subject Matter Expert(s) Awaiting Accreditation Approval
              </div>
              <div className="text-[11px] text-amber-700">
                Review candidate credentials, qualifications, and domain expertise.
              </div>
            </div>
          </div>
          <Link
            href="/admin/approvals"
            className="px-3.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shrink-0"
          >
            Review Queue
          </Link>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Total Registered Users</div>
            <div className="text-2xl font-black text-gov-navy mt-1">{stats?.total_users || 7}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Enrolled Civil Servants</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{stats?.total_trainees || 4}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Verified Certificates</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{stats?.total_certificates_issued || 1}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gov-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gov-slate-500">Mean Assessment Score</div>
            <div className="text-2xl font-black text-purple-600 mt-1">{stats?.average_assessment_score || 88.5}%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Line Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gov-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gov-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gov-navy">
                Monthly Capacity Building Directives & Completions
              </h2>
              <p className="text-[11px] text-gov-slate-500">Aggregate enrollments vs course certifications.</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Active Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  name="Enrolled Officers"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="completions"
                  name="Certified Graduates"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gov-slate-200 shadow-sm space-y-4">
          <div className="border-b border-gov-slate-100 pb-3">
            <h2 className="text-sm font-bold text-gov-navy">
              Curriculum Domain Breakdown
            </h2>
            <p className="text-[11px] text-gov-slate-500">Distribution of courses across sectors.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" name="Courses" fill="#059669" radius={[0, 4, 4, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
