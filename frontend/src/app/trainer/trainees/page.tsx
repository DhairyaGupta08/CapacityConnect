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
    <div className="space-y-6">
      <div className="border-b border-gov-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
          Learner Roster & Grading Breakdown
        </h1>
        <p className="text-xs text-gov-slate-600">
          Monitor trainee progress, examine assessment scores, and verify completion milestones.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gov-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gov-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-gov-navy">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Enrolled Civil Servants ({sampleTrainees.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gov-slate-50 text-gov-slate-500 font-bold uppercase text-[10px] border-b border-gov-slate-200">
              <tr>
                <th className="px-6 py-3">Learner</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Enrolled Course</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Exam Score</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-slate-100">
              {sampleTrainees.map((t) => (
                <tr key={t.id} className="hover:bg-gov-slate-50/60 transition">
                  <td className="px-6 py-3.5">
                    <div className="font-bold text-gov-navy">{t.name}</div>
                    <div className="text-[11px] text-gov-slate-400">{t.email}</div>
                  </td>
                  <td className="px-6 py-3.5 text-gov-slate-600">{t.organization}</td>
                  <td className="px-6 py-3.5 font-medium text-gov-navy truncate max-w-xs">{t.course}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gov-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: `${t.progress}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gov-navy text-[11px]">{t.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-gov-navy">
                    {t.score !== null ? `${t.score}%` : "—"}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === "Certified"
                        ? "bg-emerald-100 text-emerald-800"
                        : t.status === "Passed Exam"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
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
