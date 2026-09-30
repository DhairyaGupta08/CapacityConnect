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
      <div className="border-b border-gov-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
          National User & Personnel Directory
        </h1>
        <p className="text-xs text-gov-slate-600">
          Manage civil servants, subject matter trainers, and governance administrators.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl border border-gov-slate-200 shadow-sm">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-gov-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by officer name, email address, or ministry..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500 text-gov-navy"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
          >
            <option value="">All Roles</option>
            <option value="trainee">Civil Servants (Trainee)</option>
            <option value="trainer">Accredited Trainers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gov-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gov-slate-50 text-gov-slate-500 font-bold uppercase text-[10px] border-b border-gov-slate-200">
              <tr>
                <th className="px-6 py-3">Personnel Name</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Organization</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gov-slate-500 animate-pulse">
                    Loading personnel registry...
                  </td>
                </tr>
              ) : usersData?.items.map((u) => (
                <tr key={u.id} className="hover:bg-gov-slate-50/60 transition">
                  <td className="px-6 py-3.5 font-bold text-gov-navy flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gov-navy text-white text-[11px] font-bold flex items-center justify-center">
                      {u.full_name.charAt(0)}
                    </div>
                    <span>{u.full_name}</span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-[11px] text-gov-slate-500">{u.email}</td>
                  <td className="px-6 py-3.5 text-gov-slate-600">{u.organization || "—"}</td>
                  <td className="px-6 py-3.5">
                    <span className="capitalize font-semibold text-gov-navy">{u.role}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : u.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {u.status === "active" ? (
                      <button
                        onClick={() => updateStatusMutation.mutate({ userId: u.id, status: "suspended" })}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatusMutation.mutate({ userId: u.id, status: "active" })}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-800"
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
