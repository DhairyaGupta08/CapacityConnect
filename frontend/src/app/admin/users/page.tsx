"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { PaginatedResponse, User } from "@/types/api";
import { Building, Mail, Phone, Search, Shield, UserCheck, Users } from "lucide-react";

export default function AdminUsersDirectoryPage() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: usersData, isLoading } = useQuery<PaginatedResponse<User>>({
    queryKey: ["admin-users", roleFilter, searchQuery, page],
    queryFn: () =>
      apiClient<PaginatedResponse<User>>("/users", {
        params: {
          role: roleFilter || undefined,
          q: searchQuery || undefined,
          page,
          page_size: 15,
        },
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      apiClient(`/users/${userId}/status?new_status=${status}`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#12355B] tracking-tight">
          National User & Personnel Directory
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Manage civil servants, subject matter trainers, and governance administrators.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)]">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by officer name, email address, or ministry..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] text-[#172B4D] bg-[#F7F9FC]"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] bg-[#F7F9FC] text-[#172B4D]"
          >
            <option value="">All Roles</option>
            <option value="trainee">Civil Servants (Trainee)</option>
            <option value="trainer">Accredited Trainers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_4px_20px_rgba(18,53,91,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9FC] text-[#64748B] font-semibold uppercase text-[10px] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-3">Personnel Name</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Organization</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#64748B] animate-pulse">
                    Loading personnel registry...
                  </td>
                </tr>
              ) : usersData?.items.map((u) => (
                <tr key={u.id} className="hover:bg-[#F7F9FC] transition">
                  <td className="px-6 py-3.5 font-semibold text-[#172B4D] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#12355B] text-white text-[11px] font-bold flex items-center justify-center">
                      {u.full_name.charAt(0)}
                    </div>
                    <span>{u.full_name}</span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-[11px] text-[#64748B]">{u.email}</td>
                  <td className="px-6 py-3.5 text-[#64748B]">{u.organization || "—"}</td>
                  <td className="px-6 py-3.5">
                    <span className="capitalize font-medium text-[#12355B]">{u.role}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      u.status === "active"
                        ? "bg-[#E8F8F0] text-[#16875D] border border-[#16875D]/20"
                        : u.status === "pending"
                        ? "bg-[#FEF8E7] text-[#D89B18] border border-[#D89B18]/20"
                        : "bg-[#FDF2F2] text-[#D64545] border border-[#D64545]/20"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {u.status === "active" ? (
                      <button
                        onClick={() => updateStatusMutation.mutate({ userId: u.id, status: "suspended" })}
                        className="text-xs font-semibold text-[#D64545] hover:underline"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatusMutation.mutate({ userId: u.id, status: "active" })}
                        className="text-xs font-semibold text-[#16875D] hover:underline"
                      >
                        Activate
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
