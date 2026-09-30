"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Announcement } from "@/types/api";
import { Bell, CheckCircle2, Megaphone, Plus, Send } from "lucide-react";

export default function AdminAnnouncementsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetRole, setTargetRole] = useState<"all" | "trainee" | "trainer" | "admin">("all");
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: () => apiClient<Announcement[]>("/announcements"),
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      apiClient<Announcement>("/announcements", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setTitle("");
      setContent("");
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      content,
      target_role: targetRole,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#12355B] tracking-tight">
          System Broadcasts & Announcements
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Publish national training directives, policy updates, and compliance alerts to civil servants.
        </p>
      </div>

      {/* Broadcast Creator Form */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-5">
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
          <Megaphone className="w-5 h-5 text-[#00A6A6]" />
          <h2 className="font-bold text-sm text-[#12355B]">Publish New Broadcast Directive</h2>
        </div>

        {isSuccess && (
          <div className="p-3 rounded-lg bg-[#E8F8F0] border border-[#16875D]/30 text-[#16875D] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16875D]" />
            <span>Broadcast directive successfully published to the registry!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                Announcement Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mandatory Cybersecurity Directive Q3 2026"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] font-medium text-[#172B4D] bg-[#F7F9FC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                Target Audience
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] bg-[#F7F9FC] text-[#172B4D]"
              >
                <option value="all">All Personnel (Public)</option>
                <option value="trainee">Civil Servants (Trainees Only)</option>
                <option value="trainer">Accredited Instructors Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
              Directive Content & Guidance Notes
            </label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter full guidance directives..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] text-[#172B4D] bg-[#F7F9FC] leading-relaxed"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-5 py-2.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {createMutation.isPending ? "Broadcasting..." : "Publish Directive"}
            </button>
          </div>
        </form>
      </div>

      {/* Active Broadcasts History */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4">
        <h2 className="font-bold text-sm text-[#12355B] border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#12355B]" />
          Active Broadcast Directives ({announcements?.length || 0})
        </h2>

        <div className="space-y-3">
          {announcements?.map((a) => (
            <div key={a.id} className="p-4 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#12355B]">{a.title}</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#DFF5F3] text-[#12355B] border border-[#00A6A6]/20">
                  Target: {a.target_role}
                </span>
              </div>
              <p className="text-xs text-[#172B4D] leading-relaxed">{a.content}</p>
              <div className="text-[10px] text-[#64748B] pt-1">
                Published: {new Date(a.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
