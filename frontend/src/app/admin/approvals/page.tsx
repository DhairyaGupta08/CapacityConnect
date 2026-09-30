"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { PaginatedResponse, User } from "@/types/api";
import {
  AlertTriangle,
  Building,
  Check,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  Phone,
  Shield,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";

export default function AdminApprovalsPage() {
  const queryClient = useQueryClient();

  // Fetch pending trainers
  const { data: pendingUsers, isLoading } = useQuery<PaginatedResponse<User>>({
    queryKey: ["pending-users"],
    queryFn: () => apiClient<PaginatedResponse<User>>("/users?role=trainer&status=pending"),
  });

  // Fetch all trainers
  const { data: allTrainers } = useQuery<PaginatedResponse<User>>({
    queryKey: ["all-trainers"],
    queryFn: () => apiClient<PaginatedResponse<User>>("/users?role=trainer"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      apiClient(`/users/${userId}/status?new_status=${status}`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["all-trainers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-gov-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
          Trainer Accreditation & Approvals Queue
        </h1>
        <p className="text-xs text-gov-slate-600">
          Verify candidate pedagogical background, review institutional affiliations, and grant instructor privileges.
        </p>
      </div>

      {/* Pending Queue Section */}
      <div className="bg-white rounded-2xl border border-gov-slate-200 overflow-hidden shadow-sm space-y-4">
        <div className="p-4 bg-amber-50/70 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Pending Accreditation Review ({pendingUsers?.total || 0})</span>
          </div>
          <span className="text-[11px] text-amber-800 font-semibold">
            Requires Admin Action
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-gov-slate-500 animate-pulse">
            Loading candidate queue...
          </div>
        ) : pendingUsers?.items.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-gov-navy">All Applications Reviewed</h3>
            <p className="text-xs text-gov-slate-500">There are no pending instructor registrations waiting for approval.</p>
          </div>
        ) : (
          <div className="divide-y divide-gov-slate-100">
            {pendingUsers?.items.map((candidate) => (
              <div
                key={candidate.id}
                className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-gov-slate-50 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 font-black text-lg flex items-center justify-center shrink-0 border border-amber-300">
                    {candidate.full_name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-gov-navy">{candidate.full_name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                        Pending
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gov-slate-500">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {candidate.email}</span>
                      {candidate.organization && (
                        <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {candidate.organization}</span>
                      )}
                      {candidate.phone && (
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {candidate.phone}</span>
                      )}
                    </div>
                    {candidate.bio && (
                      <p className="text-xs text-gov-slate-600 max-w-xl leading-relaxed pt-1">
                        {candidate.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => updateStatusMutation.mutate({ userId: candidate.id, status: "active" })}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Approve Instructor
                  </button>
                  <button
                    onClick={() => updateStatusMutation.mutate({ userId: candidate.id, status: "rejected" })}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs transition flex items-center justify-center gap-1"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Active Instructors Roster */}
      <div className="bg-white rounded-2xl border border-gov-slate-200 overflow-hidden shadow-sm space-y-4">
        <div className="p-4 border-b border-gov-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-gov-navy">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Accredited Instructor Directory ({allTrainers?.total || 0})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gov-slate-50 text-gov-slate-500 font-bold uppercase text-[10px] border-b border-gov-slate-200">
              <tr>
                <th className="px-6 py-3">Instructor Name</th>
                <th className="px-6 py-3">Organization</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-slate-100">
              {allTrainers?.items.map((trainer) => (
                <tr key={trainer.id} className="hover:bg-gov-slate-50/60 transition">
                  <td className="px-6 py-3.5 font-bold text-gov-navy">{trainer.full_name}</td>
                  <td className="px-6 py-3.5 text-gov-slate-600">{trainer.organization || "Independent Expert"}</td>
                  <td className="px-6 py-3.5 text-gov-slate-500 font-mono text-[11px]">{trainer.email}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      trainer.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : trainer.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}>
                      {trainer.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {trainer.status === "active" ? (
                      <button
                        onClick={() => updateStatusMutation.mutate({ userId: trainer.id, status: "suspended" })}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatusMutation.mutate({ userId: trainer.id, status: "active" })}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-800"
                      >
                        Re-Activate
                      </button>
                    )}
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
