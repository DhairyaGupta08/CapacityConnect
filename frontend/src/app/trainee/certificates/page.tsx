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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gov-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
            My Verified Certifications
          </h1>
          <p className="text-xs text-gov-slate-600">
            Download your accredited digital certificates or share public verification seals.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 bg-gov-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : certificates?.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gov-slate-200 text-center space-y-4">
          <Award className="w-12 h-12 text-gov-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-gov-navy">No Certificates Earned Yet</h2>
          <p className="text-xs text-gov-slate-500">
            Complete 100% of your course curriculum and pass the timed assessment (70%+) to earn your first certified credential.
          </p>
          <Link
            href="/trainee/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-500"
          >
            Go to My Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates?.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-gov-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Card Header Banner */}
              <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>National Verified Certificate</span>
                </div>
                <span className="font-mono text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded">
                  {cert.certificate_code}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-3">
                <div className="text-[10px] font-bold text-gov-slate-400 uppercase tracking-wider">
                  Accredited Program
                </div>
                <h3 className="font-extrabold text-base text-gov-navy leading-snug">
                  {cert.course_title}
                </h3>

                <div className="pt-2 flex items-center gap-4 text-xs text-gov-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gov-navy" />
                    <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Seal
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-gov-slate-50 border-t border-gov-slate-100 flex items-center justify-between gap-3">
                <Link
                  href={`/verify/${cert.certificate_code}`}
                  className="px-3.5 py-2 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Public Seal
                </Link>

                <a
                  href={`/api/certificates/download/${cert.certificate_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
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
