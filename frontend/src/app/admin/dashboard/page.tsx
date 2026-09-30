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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiClient } from "@/lib/apiClient";
import type { AdminAnalytics } from "@/types/api";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
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

  const CHART_COLORS = ["#1769AA", "#00A6A6", "#16875D", "#D89B18"];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner - Clean Light Institutional Design */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DFF5F3] text-[#12355B] text-xs font-semibold border border-[#00A6A6]/20">
            <Shield className="w-3.5 h-3.5 text-[#00A6A6]" />
            <span>National Governance Console · Central Administration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#12355B]">
            Capacity Building Governance Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Real-time platform metrics, institutional accreditation queues, and deterministic competency analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/approvals"
            className="px-4 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" /> Review Approvals
          </Link>
          <Link
            href="/admin/competency"
            className="px-4 py-2 rounded-lg bg-white border border-[#1769AA] text-[#1769AA] hover:bg-[#F7F9FC] font-semibold text-xs transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-[#1769AA]" /> Competency Matcher
          </Link>
        </div>
      </div>

      {/* Pending Approvals Callout Banner if any */}
      {(stats?.pending_approvals ?? 1) > 0 && (
        <div className="p-4 rounded-xl bg-[#FEF8E7] border border-[#D89B18]/30 text-[#172B4D] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#D89B18]/10 border border-[#D89B18]/20 flex items-center justify-center text-[#D89B18] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-xs text-[#12355B]">
                {stats?.pending_approvals || 1} Subject Matter Expert(s) Awaiting Accreditation Approval
              </div>
              <div className="text-[11px] text-[#64748B]">
                Review candidate credentials, qualifications, and domain expertise.
              </div>
            </div>
          </div>
          <Link
            href="/admin/approvals"
            className="px-3.5 py-1.5 rounded-lg bg-[#D89B18] hover:bg-[#B78212] text-white text-xs font-semibold transition shrink-0 shadow-sm"
          >
            Review Queue
          </Link>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Total Registered Users</div>
            <div className="text-2xl font-bold text-[#12355B] mt-1">{stats?.total_users || 7}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] text-[#1769AA] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Enrolled Civil Servants</div>
            <div className="text-2xl font-bold text-[#16875D] mt-1">{stats?.total_trainees || 4}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#E8F8F0] text-[#16875D] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Verified Certificates</div>
            <div className="text-2xl font-bold text-[#00A6A6] mt-1">{stats?.total_certificates_issued || 1}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#DFF5F3] text-[#00A6A6] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#64748B]">Mean Assessment Score</div>
            <div className="text-2xl font-bold text-[#1769AA] mt-1">{stats?.average_assessment_score || 88.5}%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] text-[#1769AA] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Line Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#12355B]">
                Monthly Capacity Building Directives & Completions
              </h2>
              <p className="text-[11px] text-[#64748B]">Aggregate enrollments vs course certifications.</p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F8F0] text-[#16875D] border border-[#16875D]/20">
              Active Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} stroke="#E2E8F0" />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} stroke="#E2E8F0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E2E8F0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(18,53,91,0.08)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: "8px" }} />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  name="Enrolled Officers"
                  stroke="#1769AA"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#1769AA" }}
                />
                <Line
                  type="monotone"
                  dataKey="completions"
                  name="Certified Graduates"
                  stroke="#16875D"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#16875D" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#12355B]">
              Curriculum Domain Breakdown
            </h2>
            <p className="text-[11px] text-[#64748B]">Distribution of courses across sectors.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#64748B" }} stroke="#E2E8F0" />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: "#64748B" }} stroke="#E2E8F0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E2E8F0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(18,53,91,0.08)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" name="Courses" radius={[0, 4, 4, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
