"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { Clock, HelpCircle, LogOut, ShieldAlert } from "lucide-react";

export default function PendingApprovalPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gov-slate-100">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gov-slate-200 p-8 shadow-sm text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
          <Clock className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        <div className="space-y-1.5">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase tracking-wider">
            Status: Awaiting Governance Approval
          </span>
          <h1 className="text-xl font-extrabold text-gov-navy tracking-tight">
            Accreditation Review in Progress
          </h1>
          <p className="text-xs text-gov-slate-600 leading-relaxed">
            Welcome, <span className="font-semibold text-gov-navy">{user?.full_name || "Trainer"}</span>. Your application as a Subject Matter Expert has been submitted to the National Capacity Building Commission for verification.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gov-slate-50 border border-gov-slate-200 text-left space-y-2 text-xs text-gov-slate-600">
          <div className="font-bold text-gov-navy text-[11px] uppercase tracking-wider">
            Review Protocol & SLA:
          </div>
          <ul className="space-y-1.5 list-disc pl-4 text-gov-slate-500">
            <li>Identity & departmental affiliation check</li>
            <li>Subject matter expertise validation</li>
            <li>Approval typically processed within 24–48 hours</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => logout()}
            className="w-full py-2.5 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <Link
            href="/"
            className="text-xs font-semibold text-gov-slate-500 hover:text-gov-navy transition"
          >
            Return to Public Home
          </Link>
        </div>
      </div>
    </div>
  );
}
