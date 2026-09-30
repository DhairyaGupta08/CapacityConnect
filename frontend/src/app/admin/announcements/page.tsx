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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-gov-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
          System Broadcasts & Announcements
        </h1>
        <p className="text-xs text-gov-slate-600">
          Publish national training directives, policy updates, and compliance alerts to civil servants.
        </p>
      </div>

      {/* Broadcast Creator Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gov-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-gov-slate-100 pb-3">
          <Megaphone className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-sm text-gov-navy">Publish New Broadcast Alert</h2>
        </div>

        {isSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Broadcast alert successfully distributed to target audience!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                Announcement Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mandatory Cybersecurity Directive Q3 2026"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500 font-medium text-gov-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                Target Audience
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="all">All Personnel (Public)</option>
                <option value="trainee">Civil Servants (Trainees Only)</option>
                <option value="trainer">Accredited Instructors Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
              Directive Content & Guidance Notes
            </label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter full guidance directives..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500 leading-relaxed"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {createMutation.isPending ? "Broadcasting..." : "Publish Directive"}
            </button>
          </div>
        </form>
      </div>

      {/* Active Broadcasts History */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gov-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-sm text-gov-navy border-b border-gov-slate-100 pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-gov-navy" />
          Active Broadcast Directives ({announcements?.length || 0})
        </h2>

        <div className="space-y-3">
          {announcements?.map((a) => (
            <div key={a.id} className="p-4 rounded-xl bg-gov-slate-50 border border-gov-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-gov-navy">{a.title}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Target: {a.target_role}
                </span>
              </div>
              <p className="text-xs text-gov-slate-600 leading-relaxed">{a.content}</p>
              <div className="text-[10px] text-gov-slate-400 pt-1">
                Published: {new Date(a.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
