"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Award, CheckCircle2, Clock, Search, Users } from "lucide-react";

export default function TrainerTraineesPage() {
  const sampleTrainees = [
    {
      id: "1",
      name: "Arun Kumar",
      email: "arun.kumar@capacity-connect.example",
      organization: "Department of Telecommunications",
      course: "Cybersecurity Fundamentals for Government Information Systems",
      progress: 100,
      score: 100,
      status: "Certified",
    },
    {
      id: "2",
      name: "Priya Singh",
      email: "priya.singh@capacity-connect.example",
      organization: "National Health Authority",
      course: "Architecting Digital Public Infrastructure (DPI) & India Stack",
      progress: 45,
      score: null,
      status: "In Progress",
    },
    {
      id: "3",
      name: "Deepak Mehta",
      email: "deepak.mehta@capacity-connect.example",
      organization: "Ministry of Finance",
      course: "Cybersecurity Fundamentals for Government Information Systems",
      progress: 80,
      score: 85,
      status: "Passed Exam",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#12355B] tracking-tight">
          Learner Roster & Grading Breakdown
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Monitor trainee progress, examine assessment scores, and verify completion milestones.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_4px_20px_rgba(18,53,91,0.06)]">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-[#12355B]">
            <Users className="w-4 h-4 text-[#1769AA]" />
            <span>Enrolled Civil Servants ({sampleTrainees.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9FC] text-[#64748B] font-semibold uppercase text-[10px] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-3">Learner</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Enrolled Course</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Exam Score</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {sampleTrainees.map((t) => (
                <tr key={t.id} className="hover:bg-[#F7F9FC] transition">
                  <td className="px-6 py-3.5">
                    <div className="font-semibold text-[#172B4D]">{t.name}</div>
                    <div className="text-[11px] text-[#64748B] font-mono">{t.email}</div>
                  </td>
                  <td className="px-6 py-3.5 text-[#64748B]">{t.organization}</td>
                  <td className="px-6 py-3.5 font-medium text-[#12355B] truncate max-w-xs">{t.course}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#16875D] h-1.5 rounded-full"
                          style={{ width: `${t.progress}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-[#172B4D] text-[11px]">{t.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-[#12355B]">
                    {t.score !== null ? `${t.score}%` : "—"}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      t.status === "Certified"
                        ? "bg-[#E8F8F0] text-[#16875D] border border-[#16875D]/20"
                        : t.status === "Passed Exam"
                        ? "bg-[#DFF5F3] text-[#12355B] border border-[#00A6A6]/20"
                        : "bg-[#FEF8E7] text-[#D89B18] border border-[#D89B18]/20"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
