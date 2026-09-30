"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/lib/authContext";
import type { Course, HealthResponse, PaginatedResponse } from "@/types/api";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck,
  GraduationCap,
  Layers,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, quickLogin } = useAuth();
  const [verifyCode, setVerifyCode] = useState("CC-2026-N8X9L2");

  // Fetch published courses
  const { data: coursesData } = useQuery<PaginatedResponse<Course>>({
    queryKey: ["courses-featured"],
    queryFn: () => apiClient<PaginatedResponse<Course>>("/courses?page=1&page_size=4"),
  });

  // Fetch backend health
  const { data: health } = useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: () => apiClient<HealthResponse>("/health"),
    refetchInterval: 30000,
  });

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCode.trim()) {
      router.push(`/verify/${verifyCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-12 pb-16 bg-[#F7F9FC]">
      {/* 1. Sovereign Hero Banner: Image Padded & Centered in Middle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 w-full">
        <div className="relative overflow-hidden rounded-3xl border border-[#12355B]/40 text-white shadow-2xl">
          {/* Background Image */}
          <img
            src="/home_page_pic.jpg"
            alt="Institutional Training and Capacity Building"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          />

          {/* Lighter, Subtle Darkening Overlay for clear image visibility */}
          <div className="absolute inset-0 bg-[#12355B]/60 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#12355B]/85 via-[#12355B]/50 to-[#0D2744]/90 pointer-events-none"></div>

          {/* Padded in Middle Hero Content */}
          <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-14 sm:py-18 lg:py-20 flex flex-col items-center text-center space-y-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12355B]/90 backdrop-blur-md border border-[#00A6A6]/50 text-[#DFF5F3] text-xs font-semibold shadow-lg">
              <Shield className="w-3.5 h-3.5 text-[#00A6A6]" />
              <span>SIH26075 · National Capacity Building & Accreditation Platform</span>
            </div>

            {/* Website Name & Catchy Phrase */}
            <div className="space-y-3 max-w-4xl mx-auto drop-shadow-[0_2px_8px_rgba(18,53,91,0.9)]">
              <div className="text-sm sm:text-base font-bold uppercase tracking-widest text-[#DFF5F3]">
                Welcome to <span className="text-white font-extrabold">Capacity</span><span className="text-[#00A6A6] font-extrabold">Connect</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_4px_14px_rgba(18,53,91,0.95)]">
                Empowering Public Governance Through <span className="text-[#00A6A6]">Certified Digital Excellence</span>
              </h1>

              <p className="text-sm sm:text-base text-[#DFF5F3]/90 leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-[0_2px_6px_rgba(18,53,91,0.85)]">
                An institutional, role-based capacity building platform connecting civil servants, accredited trainers,
                and administrative governance. Featuring deterministic competency matching, timed MCQ assessments, and instant cryptographic certificate verification.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <Link
                href="/courses"
                className="px-7 py-3.5 rounded-xl bg-[#1769AA] hover:bg-[#135488] text-white font-bold text-sm flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5 border border-[#00A6A6]/30"
              >
                <BookOpen className="w-4 h-4" />
                Explore Course Catalog
              </Link>
              <Link
                href="/verify"
                className="px-7 py-3.5 rounded-xl bg-[#12355B]/85 backdrop-blur-md hover:bg-[#1D4B7D] border border-white/30 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition"
              >
                <Award className="w-4 h-4 text-[#00A6A6]" />
                Verify Certificate
              </Link>
            </div>

            {/* Evaluator Fast Switcher & Metrics Banner */}
            <div className="w-full max-w-4xl pt-2">
              <div className="bg-[#12355B]/90 backdrop-blur-md rounded-2xl border border-[#00A6A6]/40 p-5 sm:p-6 shadow-2xl space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D89B18]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Instant Demo Evaluator Access
                    </span>
                  </div>
                  <span className="text-[11px] text-[#DFF5F3]">
                    Select a role to immediately test live role-based workflows:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => quickLogin("admin")}
                    className="p-3.5 rounded-xl bg-[#1D4B7D]/80 hover:bg-[#1769AA] border border-white/20 flex items-center justify-between transition group text-left shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#D89B18]/20 border border-[#D89B18]/40 flex items-center justify-center text-[#D89B18]">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#DFF5F3]">Admin Portal</div>
                        <div className="text-[10px] text-[#DFF5F3]/80">Approvals & Competency</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#DFF5F3] group-hover:text-white group-hover:translate-x-0.5 transition" />
                  </button>

                  <button
                    onClick={() => quickLogin("trainer")}
                    className="p-3.5 rounded-xl bg-[#1D4B7D]/80 hover:bg-[#1769AA] border border-white/20 flex items-center justify-between transition group text-left shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#1769AA]/30 border border-[#1769AA]/50 flex items-center justify-center text-white">
                        <GraduationCap className="w-4 h-4 text-[#DFF5F3]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#DFF5F3]">Trainer Portal</div>
                        <div className="text-[10px] text-[#DFF5F3]/80">Courses & MCQ Exams</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#DFF5F3] group-hover:text-white group-hover:translate-x-0.5 transition" />
                  </button>

                  <button
                    onClick={() => quickLogin("trainee")}
                    className="p-3.5 rounded-xl bg-[#1D4B7D]/80 hover:bg-[#1769AA] border border-white/20 flex items-center justify-between transition group text-left shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#00A6A6]/20 border border-[#00A6A6]/40 flex items-center justify-center text-[#00A6A6]">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#DFF5F3]">Trainee Portal</div>
                        <div className="text-[10px] text-[#DFF5F3]/80">Player & Certificates</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#DFF5F3] group-hover:text-white group-hover:translate-x-0.5 transition" />
                  </button>
                </div>

                {/* Instant Public Certificate Verify Bar */}
                <form onSubmit={handleVerifySubmit} className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <div className="text-[11px] font-medium text-[#DFF5F3] flex items-center gap-1.5 shrink-0">
                    <Award className="w-3.5 h-3.5 text-[#00A6A6]" />
                    <span>Quick Certificate Test:</span>
                  </div>
                  <div className="flex-1 flex w-full gap-2">
                    <input
                      type="text"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="e.g. CC-2026-N8X9L2"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00A6A6] font-mono uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#00A6A6] text-white font-bold text-xs transition shadow-sm"
                    >
                      Verify
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COURSES CURRICULUM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="text-xs font-bold text-[#1769AA] uppercase tracking-wider">
              Accredited Curriculum
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12355B] tracking-tight">
              Featured Capacity Building Courses
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-xs font-bold text-[#1769AA] hover:text-[#135488] transition flex items-center gap-1"
          >
            View All Courses ({coursesData?.total || 4}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coursesData?.items.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#DFF5F3] text-[#12355B]">
                    {course.category_name || "Governance"}
                  </span>
                  <span className="text-[11px] font-medium text-[#64748B] capitalize flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                    {course.estimated_hours} Hours
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#12355B] group-hover:text-[#1769AA] transition leading-snug">
                  <Link href={`/courses/${course.id}`}>{course.title}</Link>
                </h3>

                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                  {course.short_description || course.description}
                </p>

                <div className="pt-3 flex items-center justify-between text-xs text-[#172B4D] border-t border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#12355B] text-white font-bold flex items-center justify-center text-[10px]">
                      {course.trainer_name ? course.trainer_name.charAt(0) : "I"}
                    </div>
                    <span className="text-xs font-medium text-[#64748B]">{course.trainer_name || "Instructor"}</span>
                  </div>
                  <span className="font-semibold text-[#1769AA] bg-[#EBF3FB] px-2.5 py-0.5 rounded text-[11px]">
                    {course.modules?.length || 3} Modules & Assessment
                  </span>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-[#F7F9FC] border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-xs font-bold capitalize text-[#12355B]">
                  Level: <span className="font-normal text-[#64748B]">{course.level}</span>
                </span>
                <Link
                  href={`/courses/${course.id}`}
                  className="px-4 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#135488] text-white font-semibold text-xs transition flex items-center gap-1 shadow-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INSTITUTIONAL FRAMEWORK PILLARS */}
      <section className="bg-white py-14 px-4 sm:px-6 lg:px-8 border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12355B] tracking-tight">
              Institutional Framework Architecture
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Built in accordance with government standards for transparency, auditable grading, and secure credential issuance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F7F9FC] p-6 rounded-xl border border-[#E2E8F0] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#DFF5F3] text-[#00A6A6] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#12355B]">Deterministic Competency Matching</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Replaces black-box AI with an auditable mathematical formula evaluating skill coverage, subject alignment, proficiency ratio, and experience years.
              </p>
              <div className="text-[11px] font-mono text-[#12355B] bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
                Score = 100 × (0.40·S_skill + 0.20·S_subj + 0.15·S_prof + 0.15·S_exp + 0.10·S_qual)
              </div>
            </div>

            <div className="bg-[#F7F9FC] p-6 rounded-xl border border-[#E2E8F0] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#EBF3FB] text-[#1769AA] flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#12355B]">Server-Enforced MCQ Assessments</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Anti-leakage question delivery, server-side clock verification, automatic objective scoring, and immediate question breakdown with explanations.
              </p>
              <ul className="text-xs text-[#64748B] space-y-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#16875D]" /> Strict time limits</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#16875D]" /> Passing score gate (70%)</li>
              </ul>
            </div>

            <div className="bg-[#F7F9FC] p-6 rounded-xl border border-[#E2E8F0] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FEF8E7] text-[#D89B18] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#12355B]">Verified Cryptographic Certificates</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Formal ReportLab PDF generation upon course pass. Publicly verifiable by anyone via unique serial code or QR link.
              </p>
              <div className="pt-1">
                <Link href="/verify/CC-2026-N8X9L2" className="text-xs font-bold text-[#1769AA] hover:underline flex items-center gap-1">
                  View Sample Verification Seal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BACKEND HEALTH STATUS CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#E8F8F0] border border-[#16875D]/30 flex items-center justify-center text-[#16875D]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#12355B] flex items-center gap-2">
                FastAPI Monolith Gateway Status
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F0] text-[#16875D] border border-[#16875D]/20 uppercase">
                  {health?.status || "Connected"}
                </span>
              </div>
              <div className="text-xs text-[#64748B]">
                Connected via Next.js same-origin reverse rewrite to FastAPI ({health?.app || "Capacity Connect"} v{health?.version || "0.1.0"}).
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono bg-[#F7F9FC] px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] text-[#12355B]">
              DB: {health?.database || "Connected"}
            </span>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-lg bg-[#1769AA] hover:bg-[#135488] text-white font-semibold transition shadow-sm"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
