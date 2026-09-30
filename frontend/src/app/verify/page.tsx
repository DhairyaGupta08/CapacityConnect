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
    <div className="flex-1 bg-[#F7F9FC] py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-xl bg-[#DFF5F3] border border-[#00A6A6]/30 flex items-center justify-center mx-auto text-[#00A6A6]">
            <Award className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF5F3] border border-[#00A6A6]/20 text-[#12355B] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A6A6]" />
            National Accreditation Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#12355B] tracking-tight">
            Certificate & Credential Verification
          </h1>
          <p className="text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed">
            Verify the authenticity, examination grade, and accreditation status of any digital certificate issued by Capacity Connect. Enter the unique serial code printed on the official document.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="bg-white p-7 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-2">
                Certificate Serial Code
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CC-2026-N8X9L2"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] font-mono text-[#172B4D] uppercase tracking-wider bg-[#F7F9FC]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-white" /> Verify Credential Authenticity
            </button>
          </form>

          {/* Quick Click Demo Codes */}
          <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
            <div className="text-xs font-medium text-[#64748B]">
              Sample Verified Serial for Instant Testing:
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleCodes.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => router.push(`/verify/${c}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9FC] hover:bg-[#DFF5F3] hover:text-[#12355B] hover:border-[#00A6A6]/40 border border-[#E2E8F0] text-xs font-mono font-semibold text-[#172B4D] transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16875D]" />
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Verification Guarantee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#64748B]">
          <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E8F8F0] flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-[#16875D]" />
            </div>
            <div>
              <div className="font-semibold text-[#172B4D]">Tamper-Proof</div>
              <p className="text-[11px] text-[#64748B] mt-0.5">Cryptographically logged & timestamped</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#DFF5F3] flex items-center justify-center shrink-0">
              <QrCode className="w-4 h-4 text-[#00A6A6]" />
            </div>
            <div>
              <div className="font-semibold text-[#172B4D]">Instant Scan</div>
              <p className="text-[11px] text-[#64748B] mt-0.5">Integrated high-density QR verification</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4 text-[#1769AA]" />
            </div>
            <div>
              <div className="font-semibold text-[#172B4D]">Official PDF</div>
              <p className="text-[11px] text-[#64748B] mt-0.5">Direct sovereign PDF export & archive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
