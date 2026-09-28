"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { PublicVerification } from "@/types/api";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Building,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  Printer,
  QrCode,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

export default function VerifyCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = use(params);
  const code = resolvedParams.code.toUpperCase();

  const { data: cert, isLoading, isError } = useQuery<PublicVerification>({
    queryKey: ["verify-cert", code],
    queryFn: () => apiClient<PublicVerification>(`/certificates/verify/${code}`),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex-1 bg-gov-slate-100 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto"></div>
          <div className="font-bold text-gov-navy text-sm">Verifying accreditation record with national registry...</div>
        </div>
      </div>
    );
  }

  if (isError || !cert) {
    return (
      <div className="flex-1 bg-gov-slate-100 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold text-gov-navy">Invalid Certificate Code</h1>
          <p className="text-xs text-gov-slate-600 leading-relaxed">
            No active certificate matching code <span className="font-mono font-bold text-gov-navy">{code}</span> was found in the Capacity Connect database.
          </p>
          <div className="pt-2">
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gov-navy text-white text-xs font-bold hover:bg-gov-navy-dark transition"
            >
              <ArrowLeft className="w-4 h-4" /> Try Another Code
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const issueDateFormatted = new Date(cert.issue_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex-1 bg-gov-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/verify"
          className="inline-flex items-center gap-1.5 text-xs text-gov-slate-600 hover:text-gov-navy font-bold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Verification Search
        </Link>

        {/* Official Sovereign Certificate Badge Card */}
        <div className="bg-white rounded-2xl border border-gov-slate-200 overflow-hidden shadow-lg">
          {/* Top Validity Banner */}
          <div className={`p-4 sm:p-6 text-white flex items-center justify-between ${
            cert.is_valid ? "bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800" : "bg-rose-700"
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0">
                {cert.is_valid ? <ShieldCheck className="w-7 h-7 text-emerald-300" /> : <AlertTriangle className="w-7 h-7 text-rose-300" />}
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                  National Accreditation Seal
                </div>
                <h1 className="text-lg sm:text-xl font-black text-white">
                  {cert.is_valid ? "OFFICIALLY VERIFIED & VALID" : "REVOKED CERTIFICATE"}
                </h1>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-emerald-200 uppercase font-bold">Serial Code</div>
              <div className="font-mono text-xs font-black tracking-widest">{cert.certificate_code}</div>
            </div>
          </div>

          {/* Certificate Main Body */}
          <div className="p-6 sm:p-10 space-y-8">
            <div className="text-center space-y-2 border-b border-gov-slate-100 pb-6">
              <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
                Capacity Connect · Digital Capacity Building Portal
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gov-navy">
                CERTIFICATE OF COMPLETION
              </h2>
              <p className="text-xs text-gov-slate-500">
                This certifies that the recipient has fulfilled all curriculum requirements and successfully passed the examination.
              </p>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gov-slate-50 p-6 rounded-xl border border-gov-slate-200">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-gov-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gov-navy" /> Awarded To
                </div>
                <div className="text-base font-extrabold text-gov-navy">{cert.recipient_name}</div>
                <div className="text-xs text-gov-slate-500 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" /> {cert.organization}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold text-gov-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-gov-navy" /> Certified Course
                </div>
                <div className="text-sm font-extrabold text-gov-navy leading-snug">{cert.course_title}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold text-gov-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gov-navy" /> Issue Date
                </div>
                <div className="text-xs font-bold text-gov-slate-800">{issueDateFormatted}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold text-gov-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" /> Assessment Score
                </div>
                <div className="text-xs font-extrabold text-emerald-700">
                  {cert.score_percentage || 100}% (Passed)
                </div>
              </div>
            </div>

            {/* Actions: Download PDF, Print, Share */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gov-slate-100">
              <div className="text-xs text-gov-slate-500">
                Verification URL: <span className="font-mono text-gov-navy font-semibold">{window.location.href}</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`/api/certificates/download/${cert.certificate_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Official PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
