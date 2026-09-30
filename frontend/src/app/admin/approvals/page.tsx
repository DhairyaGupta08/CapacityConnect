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
    <div className="space-y-6 pb-12">
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#12355B] tracking-tight">
          Trainer Accreditation & Approvals Queue
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Verify candidate pedagogical background, review institutional affiliations, and grant instructor privileges.
        </p>
      </div>

      {/* Pending Queue Section */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-0">
        <div className="p-4 bg-[#FEF8E7] border-b border-[#D89B18]/20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-xs text-[#12355B]">
            <Clock className="w-4 h-4 text-[#D89B18]" />
            <span>Pending Accreditation Review ({pendingUsers?.total || 0})</span>
          </div>
          <span className="text-[11px] text-[#D89B18] font-semibold">
            Requires Admin Action
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#64748B] animate-pulse">
            Loading candidate queue...
          </div>
        ) : pendingUsers?.items.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#16875D] mx-auto" />
            <h3 className="font-semibold text-sm text-[#12355B]">All Applications Reviewed</h3>
            <p className="text-xs text-[#64748B]">There are no pending instructor registrations waiting for approval.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {pendingUsers?.items.map((candidate) => (
              <div
                key={candidate.id}
                className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#F7F9FC] transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#DFF5F3] text-[#12355B] font-bold text-base flex items-center justify-center shrink-0 border border-[#00A6A6]/20">
                    {candidate.full_name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#12355B]">{candidate.full_name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF8E7] text-[#D89B18] border border-[#D89B18]/20 uppercase">
                        Pending
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#1769AA]" /> {candidate.email}</span>
                      {candidate.organization && (
                        <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-[#64748B]" /> {candidate.organization}</span>
                      )}
                      {candidate.phone && (
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#64748B]" /> {candidate.phone}</span>
                      )}
                    </div>
                    {candidate.bio && (
                      <p className="text-xs text-[#172B4D] max-w-xl leading-relaxed pt-1">
                        {candidate.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => updateStatusMutation.mutate({ userId: candidate.id, status: "active" })}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-[#16875D] hover:bg-[#126b4a] text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Approve Instructor
                  </button>
                  <button
                    onClick={() => updateStatusMutation.mutate({ userId: candidate.id, status: "rejected" })}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 md:flex-none px-3.5 py-2 rounded-lg bg-[#FDF2F2] hover:bg-[#fbdada] border border-[#D64545]/20 text-[#D64545] font-semibold text-xs transition flex items-center justify-center gap-1"
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
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-0">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-[#12355B]">
            <GraduationCap className="w-4 h-4 text-[#1769AA]" />
            <span>Accredited Instructor Directory ({allTrainers?.total || 0})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9FC] text-[#64748B] font-semibold uppercase text-[10px] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-3">Instructor Name</th>
                <th className="px-6 py-3">Organization</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {allTrainers?.items.map((trainer) => (
                <tr key={trainer.id} className="hover:bg-[#F7F9FC] transition">
                  <td className="px-6 py-3.5 font-semibold text-[#172B4D]">{trainer.full_name}</td>
                  <td className="px-6 py-3.5 text-[#64748B]">{trainer.organization || "Independent Expert"}</td>
                  <td className="px-6 py-3.5 text-[#64748B] font-mono text-[11px]">{trainer.email}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      trainer.status === "active"
                        ? "bg-[#E8F8F0] text-[#16875D] border border-[#16875D]/20"
                        : trainer.status === "pending"
                        ? "bg-[#FEF8E7] text-[#D89B18] border border-[#D89B18]/20"
                        : "bg-[#FDF2F2] text-[#D64545] border border-[#D64545]/20"
                    }`}>
                      {trainer.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {trainer.status === "active" ? (
                      <button
                        onClick={() => updateStatusMutation.mutate({ userId: trainer.id, status: "suspended" })}
                        className="text-xs font-semibold text-[#D64545] hover:underline"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatusMutation.mutate({ userId: trainer.id, status: "active" })}
                        className="text-xs font-semibold text-[#16875D] hover:underline"
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
