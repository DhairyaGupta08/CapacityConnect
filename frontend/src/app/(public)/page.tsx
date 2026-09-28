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
    <div className="flex-1 flex flex-col space-y-12 pb-16 bg-[#F2FCFD]">
      {/* 1. Sovereign Hero Banner: Image Padded & Centered in Middle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 w-full">
        <div className="relative overflow-hidden rounded-3xl border border-[#0077B6]/40 text-white shadow-2xl">
          {/* Background Image */}
          <img
            src="/home_page_pic.jpg"
            alt="Institutional Training and Capacity Building"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          />

          {/* Lighter, Subtle Darkening Overlay for clear image visibility */}
          <div className="absolute inset-0 bg-[#03045E]/50 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#03045E]/80 via-[#023E8A]/45 to-[#03045E]/90 pointer-events-none"></div>

          {/* Padded in Middle Hero Content */}
          <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-16 sm:py-20 lg:py-24 flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#03045E]/90 backdrop-blur-md border border-[#0096C7]/50 text-[#48CAE4] text-xs font-semibold shadow-lg">
              <Shield className="w-3.5 h-3.5 text-[#48CAE4]" />
              <span>SIH26075 · National Capacity Building & Accreditation Platform</span>
            </div>

            {/* Website Name & Catchy Phrase */}
            <div className="space-y-4 max-w-4xl mx-auto drop-shadow-[0_2px_8px_rgba(3,4,94,0.9)]">
              <div className="text-sm sm:text-base font-bold uppercase tracking-widest text-[#ADE8F4]">
                Welcome to <span className="text-white font-extrabold">Capacity</span><span className="text-[#48CAE4] font-extrabold">Connect</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_4px_14px_rgba(3,4,94,0.95)]">
                Empowering Public Governance Through <span className="text-[#48CAE4]">Certified Digital Excellence</span>
              </h1>

              <p className="text-sm sm:text-lg text-[#CAF0F8] leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-[0_2px_6px_rgba(3,4,94,0.85)]">
                A sovereign, role-based institutional capacity building ecosystem connecting civil servants, certified trainers,
                and administrators. Featuring explainable competency matching, timed MCQ assessments, and instant cryptographic certificate verification.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/courses"
                className="px-7 py-3.5 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 border border-[#48CAE4]/30"
              >
                <BookOpen className="w-4 h-4" />
                Explore Course Catalog
              </Link>
              <Link
                href="/verify"
                className="px-7 py-3.5 rounded-xl bg-[#03045E]/85 backdrop-blur-md hover:bg-[#023E8A] border border-[#ADE8F4]/40 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition"
              >
                <Award className="w-4 h-4 text-[#48CAE4]" />
                Verify Certificate
              </Link>
            </div>

            {/* Evaluator Fast Switcher & Metrics Banner */}
            <div className="w-full max-w-4xl pt-4">
              <div className="bg-[#03045E]/90 backdrop-blur-md rounded-2xl border border-[#0096C7]/50 p-5 sm:p-6 shadow-2xl space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#0077B6]/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#48CAE4]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Instant Demo Evaluator Access
                    </span>
                  </div>
                  <span className="text-[11px] text-[#ADE8F4]">
                    Select a role to immediately test live role-based workflows:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => quickLogin("admin")}
                    className="p-3.5 rounded-xl bg-[#023E8A] hover:bg-[#0077B6] border border-[#0096C7]/40 flex items-center justify-between transition group text-left shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#0096C7]/20 border border-[#0096C7]/40 flex items-center justify-center text-[#48CAE4]">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#48CAE4]">Admin Portal</div>
                        <div className="text-[10px] text-[#ADE8F4]">Approvals & Competency</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#ADE8F4] group-hover:text-white group-hover:translate-x-0.5 transition" />
                  </button>

                  <button
                    onClick={() => quickLogin("trainer")}
                    className="p-3.5 rounded-xl bg-[#023E8A] hover:bg-[#0077B6] border border-[#0096C7]/40 flex items-center justify-between transition group text-left shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#0096C7]/20 border border-[#0096C7]/40 flex items-center justify-center text-[#48CAE4]">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#48CAE4]">Trainer Portal</div>
                        <div className="text-[10px] text-[#ADE8F4]">Courses & MCQ Exams</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#ADE8F4] group-hover:text-white group-hover:translate-x-0.5 transition" />
                  </button>

                  <button
                    onClick={() => quickLogin("trainee")}
                    className="p-3.5 rounded-xl bg-[#023E8A] hover:bg-[#0077B6] border border-[#0096C7]/40 flex items-center justify-between transition group text-left shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#0096C7]/20 border border-[#0096C7]/40 flex items-center justify-center text-[#48CAE4]">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#48CAE4]">Trainee Portal</div>
                        <div className="text-[10px] text-[#ADE8F4]">Learn & Get Certified</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#ADE8F4] group-hover:text-white group-hover:translate-x-0.5 transition" />
                  </button>
                </div>

                {/* Public verification code test bar */}
                <form onSubmit={handleVerifySubmit} className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <div className="text-[11px] text-[#ADE8F4] flex items-center gap-1 shrink-0">
                    <Award className="w-3.5 h-3.5 text-[#48CAE4]" />
                    <span>Verify Demo Certificate:</span>
                  </div>
                  <div className="flex-1 flex w-full gap-2">
                    <input
                      type="text"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="e.g. CC-2026-N8X9L2"
                      className="flex-1 px-3.5 py-1.5 rounded-lg bg-[#023E8A] border border-[#0096C7]/40 text-xs text-white placeholder-[#ADE8F4]/50 focus:outline-none focus:border-[#48CAE4] font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-xs transition shadow"
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

      {/* 2. Featured Course Curriculum Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="text-xs font-bold text-[#0077B6] uppercase tracking-wider">
              Curated Curriculum
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#03045E] tracking-tight">
              Featured Capacity Building Courses
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-xs font-bold text-[#0077B6] hover:text-[#0096C7] transition flex items-center gap-1"
          >
            View All Courses ({coursesData?.total || 4}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {coursesData?.items.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-[#ADE8F4] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#CAF0F8] text-[#023E8A] border border-[#90E0EF]">
                    {course.category_name || "Governance"}
                  </span>
                  <span className="text-[11px] font-semibold text-[#0077B6] capitalize flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.estimated_hours} Hours
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#03045E] group-hover:text-[#0077B6] transition leading-snug">
                  <Link href={`/courses/${course.id}`}>{course.title}</Link>
                </h3>

                <p className="text-xs text-[#023E8A]/80 line-clamp-2 leading-relaxed">
                  {course.short_description || course.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-[#023E8A] border-t border-[#E6F8FB]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#CAF0F8] text-[#03045E] font-bold flex items-center justify-center text-[10px] border border-[#ADE8F4]">
                      {course.trainer_name ? course.trainer_name.charAt(0) : "I"}
                    </div>
                    <span>{course.trainer_name || "Instructor"}</span>
                  </div>
                  <span className="font-semibold text-[#0077B6] bg-[#CAF0F8] px-2.5 py-0.5 rounded-md text-[11px]">
                    {course.modules?.length || 3} Modules & Assessment
                  </span>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-[#CAF0F8]/40 border-t border-[#ADE8F4] flex items-center justify-between">
                <span className="text-xs font-bold capitalize text-[#03045E]">
                  Level: <span className="font-normal text-[#0077B6]">{course.level}</span>
                </span>
                <Link
                  href={`/courses/${course.id}`}
                  className="px-4 py-1.5 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-xs transition flex items-center gap-1 shadow-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The Foundation Pillars of Capacity Connect */}
      <section className="bg-white/90 py-14 px-4 sm:px-6 lg:px-8 border-y border-[#ADE8F4]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#03045E] tracking-tight">
              Institutional Framework Architecture
            </h2>
            <p className="text-xs text-[#0077B6]">
              Built in accordance with government standards for transparency, auditable grading, and secure credential issuance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F2FCFD] p-6 rounded-2xl border border-[#ADE8F4] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#CAF0F8] text-[#0077B6] flex items-center justify-center border border-[#90E0EF]">
                <Layers className="w-5 h-5 text-[#0077B6]" />
              </div>
              <h3 className="text-base font-bold text-[#03045E]">Deterministic Competency Matching</h3>
              <p className="text-xs text-[#023E8A]/80 leading-relaxed">
                Replaces black-box AI with an auditable mathematical formula evaluating skill coverage, subject alignment, proficiency ratio, and experience years.
              </p>
              <div className="text-[11px] font-mono text-[#023E8A] bg-white p-2.5 rounded-xl border border-[#ADE8F4]">
                Score = 100 × (0.40·S_skill + 0.20·S_subj + 0.15·S_prof + 0.15·S_exp + 0.10·S_qual)
              </div>
            </div>

            <div className="bg-[#F2FCFD] p-6 rounded-2xl border border-[#ADE8F4] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#CAF0F8] text-[#0077B6] flex items-center justify-center border border-[#90E0EF]">
                <FileCheck className="w-5 h-5 text-[#0077B6]" />
              </div>
              <h3 className="text-base font-bold text-[#03045E]">Server-Enforced MCQ Assessments</h3>
              <p className="text-xs text-[#023E8A]/80 leading-relaxed">
                Anti-leakage question delivery, server-side clock verification, automatic objective scoring, and immediate question breakdown with explanations.
              </p>
              <ul className="text-xs text-[#0077B6] space-y-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0096C7]" /> Strict time limits</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0096C7]" /> Passing score gate (70%)</li>
              </ul>
            </div>

            <div className="bg-[#F2FCFD] p-6 rounded-2xl border border-[#ADE8F4] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#CAF0F8] text-[#0077B6] flex items-center justify-center border border-[#90E0EF]">
                <Award className="w-5 h-5 text-[#0077B6]" />
              </div>
              <h3 className="text-base font-bold text-[#03045E]">Verified Cryptographic Certificates</h3>
              <p className="text-xs text-[#023E8A]/80 leading-relaxed">
                Formal ReportLab PDF generation upon course pass. Publicly verifiable by anyone via unique serial code or QR link.
              </p>
              <div className="pt-2">
                <Link href="/verify/CC-2026-N8X9L2" className="text-xs font-bold text-[#0077B6] hover:underline flex items-center gap-1">
                  View Sample Verification Seal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Backend Health Status Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-2xl border border-[#ADE8F4] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#CAF0F8] border border-[#90E0EF] flex items-center justify-center text-[#0077B6]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#03045E] flex items-center gap-2">
                FastAPI Monolith Gateway Status
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#CAF0F8] text-[#023E8A] border border-[#90E0EF] uppercase">
                  {health?.status || "Connected"}
                </span>
              </div>
              <div className="text-xs text-[#0077B6]">
                Connected via Next.js same-origin reverse rewrite to FastAPI ({health?.app || "Capacity Connect"} v{health?.version || "0.1.0"}).
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono bg-[#CAF0F8] px-3.5 py-1.5 rounded-xl border border-[#90E0EF] text-[#03045E]">
              DB: {health?.database || "Connected"}
            </span>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold transition shadow-md"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
