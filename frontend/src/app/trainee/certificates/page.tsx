"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Certificate } from "@/types/api";
import {
  Award,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

export default function MyCertificatesPage() {
  const { data: certificates, isLoading } = useQuery<Certificate[]>({
    queryKey: ["my-certificates"],
    queryFn: () => apiClient<Certificate[]>("/certificates/my"),
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#12355B] tracking-tight">
            My Verified Certifications
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Download your accredited digital certificates or share public verification seals.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 bg-[#E2E8F0]/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : certificates?.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center space-y-4 shadow-[0_4px_20px_rgba(18,53,91,0.06)]">
          <Award className="w-12 h-12 text-[#64748B]/50 mx-auto" />
          <h2 className="text-lg font-bold text-[#12355B]">No Certificates Earned Yet</h2>
          <p className="text-xs text-[#64748B]">
            Complete 100% of your course curriculum and pass the timed assessment (70%+) to earn your first certified credential.
          </p>
          <Link
            href="/trainee/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1769AA] text-white font-semibold text-xs shadow-sm hover:bg-[#12355B]"
          >
            Go to My Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates?.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_4px_20px_rgba(18,53,91,0.06)] hover:border-[#1769AA]/40 transition flex flex-col justify-between"
            >
              {/* Card Header Banner */}
              <div className="bg-[#E8F8F0] border-b border-[#16875D]/20 p-4 text-[#12355B] flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#16875D]" />
                  <span>National Verified Certificate</span>
                </div>
                <span className="font-mono text-[11px] font-bold bg-white text-[#12355B] border border-[#16875D]/20 px-2 py-0.5 rounded">
                  {cert.certificate_code}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-3">
                <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Accredited Program
                </div>
                <h3 className="font-bold text-base text-[#12355B] leading-snug">
                  {cert.course_title}
                </h3>

                <div className="pt-2 flex items-center gap-4 text-xs text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#1769AA]" />
                    <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#16875D] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Seal
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-[#F7F9FC] border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                <Link
                  href={`/verify/${cert.certificate_code}`}
                  className="px-3.5 py-2 rounded-lg border border-[#E2E8F0] hover:bg-white text-[#12355B] font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Public Seal
                </Link>

                <a
                  href={`/api/certificates/download/${cert.certificate_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
