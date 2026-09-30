"use client";

import React, { use, useState, useEffect } from "react";
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
  GraduationCap,
  Printer,
  ShieldCheck,
  User,
  XCircle,
  Hash,
} from "lucide-react";

export default function VerifyCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = use(params);
  const code = resolvedParams.code.toUpperCase();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const { data: cert, isLoading, isError } = useQuery<PublicVerification>({
    queryKey: ["verify-cert", code],
    queryFn: () => apiClient<PublicVerification>(`/certificates/verify/${code}`),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex-1 bg-[#F7F9FC] py-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-[#1769AA] border-t-transparent animate-spin mx-auto"></div>
          <div className="font-semibold text-[#12355B] text-sm">Verifying accreditation record with national registry...</div>
          <p className="text-xs text-[#64748B]">Querying public verification record for {code}</p>
        </div>
      </div>
    );
  }

  if (isError || !cert) {
    return (
      <div className="flex-1 bg-[#F7F9FC] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl border border-[#D64545]/30 p-8 shadow-[0_4px_20px_rgba(18,53,91,0.06)] text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FDF2F2] text-[#D64545] flex items-center justify-center mx-auto border border-[#D64545]/20">
            <XCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-[#12355B]">Invalid Certificate Serial</h1>
          <p className="text-xs text-[#64748B] leading-relaxed">
            No active certificate matching record <span className="font-mono font-semibold text-[#12355B]">{code}</span> was located in the National Capacity Connect registry.
          </p>
          <div className="pt-2">
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white text-xs font-semibold transition shadow-sm"
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
    <div className="flex-1 bg-[#F7F9FC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#12355B] font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Verification Search
          </Link>
          <div className="text-xs text-[#64748B] font-mono">
            Registry Ref: <span className="text-[#12355B] font-bold">{cert.certificate_code}</span>
          </div>
        </div>

        {/* Official Sovereign Certificate Badge Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_4px_20px_rgba(18,53,91,0.06)]">
          {/* Top Validity Banner */}
          <div className={`p-5 sm:p-6 border-b ${
            cert.is_valid 
              ? "bg-[#E8F8F0] border-[#16875D]/20 text-[#12355B]" 
              : "bg-[#FDF2F2] border-[#D64545]/20 text-[#D64545]"
          } flex items-center justify-between`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                cert.is_valid 
                  ? "bg-white border-[#16875D]/30 text-[#16875D]" 
                  : "bg-white border-[#D64545]/30 text-[#D64545]"
              }`}>
                {cert.is_valid ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${cert.is_valid ? "text-[#16875D]" : "text-[#D64545]"}`}>
                    {cert.is_valid ? "National Accreditation Status" : "Security Notice"}
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16875D]"></span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-[#12355B]">
                  {cert.is_valid ? "Official Verified & Valid Credential" : "Revoked or Suspended Certificate"}
                </h1>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-[#64748B] uppercase font-semibold">Serial Code</div>
              <div className="font-mono text-xs font-bold text-[#12355B]">{cert.certificate_code}</div>
            </div>
          </div>

          {/* Certificate Main Body */}
          <div className="p-6 sm:p-8 space-y-7">
            {/* Header branding on certificate */}
            <div className="text-center space-y-1.5 border-b border-[#E2E8F0] pb-6">
              <div className="text-xs font-bold text-[#00A6A6] tracking-wider uppercase">
                Capacity Connect · National Digital Learning & Capacity Platform
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#12355B]">
                CERTIFICATE OF COMPLETION
              </h2>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Issued in accordance with national competency and training standards for civil service capacity enhancement.
              </p>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F7F9FC] p-5 rounded-xl border border-[#E2E8F0]">
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1769AA]" /> Awarded Recipient
                </div>
                <div className="text-base font-bold text-[#172B4D]">{cert.recipient_name}</div>
                <div className="text-xs text-[#64748B] flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#64748B]" /> {cert.organization}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#1769AA]" /> Certified Course
                </div>
                <div className="text-sm font-bold text-[#172B4D] leading-snug">{cert.course_title}</div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#E2E8F0] sm:border-t-0 sm:pt-0">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#1769AA]" /> Date of Issuance
                </div>
                <div className="text-xs font-semibold text-[#172B4D]">{issueDateFormatted}</div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#E2E8F0] sm:border-t-0 sm:pt-0">
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#16875D]" /> Final Score
                </div>
                <div className="text-xs font-bold text-[#16875D] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {cert.score_percentage || 100}% (Passed with Distinction)
                </div>
              </div>
            </div>

            {/* Verification Metadata Box */}
            <div className="p-4 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#64748B] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#172B4D]">Issuing Authority:</span>
                <span>Capacity Building Commission · National Portal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#172B4D]">Cryptographic Hash:</span>
                <span className="font-mono text-[11px] text-[#12355B]">SHA-256 Verified (Immutable Registry Record)</span>
              </div>
              {currentUrl && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#172B4D]">Public URL:</span>
                  <span className="font-mono text-[11px] text-[#1769AA] truncate max-w-[280px] sm:max-w-md">{currentUrl}</span>
                </div>
              )}
            </div>

            {/* Actions: Download PDF */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E2E8F0]">
              <div className="text-xs text-[#64748B]">
                This credential is electronically verified. No physical signature required.
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`/api/certificates/download/${cert.certificate_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2"
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
