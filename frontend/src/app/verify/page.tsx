"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  CheckCircle2,
  FileCheck,
  QrCode,
  Search,
  Shield,
  ShieldCheck,
} from "lucide-react";

export default function VerifyIndexPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/verify/${code.trim().toUpperCase()}`);
    }
  };

  const sampleCodes = ["CC-2026-N8X9L2"];

  return (
    <div className="flex-1 bg-gov-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-gov-navy flex items-center justify-center mx-auto text-white shadow-lg border border-emerald-400/40">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gov-navy tracking-tight">
            National Public Certificate Verification
          </h1>
          <p className="text-xs sm:text-sm text-gov-slate-600 max-w-lg mx-auto leading-relaxed">
            Verify the authenticity and accreditation status of any certificate issued by Capacity Connect.
            Enter the unique serial code printed on the official PDF document.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="bg-white p-8 rounded-2xl border border-gov-slate-200 shadow-md space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-2">
                Enter Certificate Serial Code
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-gov-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CC-2026-N8X9L2"
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gov-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-mono text-gov-navy uppercase tracking-wider"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Verify Credential Authenticity
            </button>
          </form>

          {/* Quick Click Demo Codes */}
          <div className="pt-4 border-t border-gov-slate-100 space-y-2">
            <div className="text-xs font-semibold text-gov-slate-500">
              Sample Verified Codes for Instant Testing:
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleCodes.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => router.push(`/verify/${c}`)}
                  className="px-3 py-1.5 rounded-lg bg-gov-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-gov-slate-200 text-xs font-mono font-bold text-gov-navy transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Verification Guarantee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gov-slate-600">
          <div className="p-4 bg-white rounded-xl border border-gov-slate-200 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-gov-navy">Tamper-Proof</div>
              <p className="text-[11px] text-gov-slate-500">Cryptographically issued & stored</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gov-slate-200 flex items-start gap-2.5">
            <QrCode className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-gov-navy">Instant Scan</div>
              <p className="text-[11px] text-gov-slate-500">Integrated QR code validation</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gov-slate-200 flex items-start gap-2.5">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-gov-navy">ReportLab PDF</div>
              <p className="text-[11px] text-gov-slate-500">Direct PDF rendering & download</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
