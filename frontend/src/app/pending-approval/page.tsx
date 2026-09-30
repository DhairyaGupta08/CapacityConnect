"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { Clock, HelpCircle, LogOut, ShieldAlert } from "lucide-react";

export default function PendingApprovalPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#F7F9FC]">
      <div className="max-w-md w-full bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-[#FEF8E7] border border-[#D89B18]/30 text-[#D89B18] flex items-center justify-center mx-auto shadow-sm">
          <Clock className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF8E7] text-[#D89B18] uppercase tracking-wider">
            Status: Awaiting Governance Approval
          </span>
          <h1 className="text-xl font-bold text-[#12355B] tracking-tight">
            Accreditation Review in Progress
          </h1>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Welcome, <span className="font-semibold text-[#12355B]">{user?.full_name || "Trainer"}</span>. Your application as a Subject Matter Expert has been submitted to the National Capacity Building Commission for verification.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] text-left space-y-2 text-xs text-[#64748B]">
          <div className="font-bold text-[#12355B] text-[11px] uppercase tracking-wider">
            Review Protocol & SLA:
          </div>
          <ul className="space-y-1.5 list-disc pl-4 text-[#64748B]">
            <li>Identity & departmental affiliation check</li>
            <li>Subject matter expertise validation</li>
            <li>Approval typically processed within 24–48 hours</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => logout()}
            className="w-full py-2.5 rounded-lg bg-[#12355B] hover:bg-[#0D2744] text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <Link
            href="/"
            className="text-xs font-semibold text-[#64748B] hover:text-[#1769AA] transition"
          >
            Return to Public Home
          </Link>
        </div>
      </div>
    </div>
  );
}

