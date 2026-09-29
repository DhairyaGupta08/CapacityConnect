"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/lib/authContext";
import type { TraineeProfile } from "@/types/api";
import {
  Briefcase,
  Building,
  CheckCircle2,
  FileText,
  GraduationCap,
  Save,
  Shield,
  User,
} from "lucide-react";

export default function TraineeProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<TraineeProfile>({
    queryKey: ["trainee-profile"],
    queryFn: () => apiClient<TraineeProfile>("/users/profile/trainee"),
  });

  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [experienceYears, setExperienceYears] = useState(5);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync state once profile is loaded
  React.useEffect(() => {
    if (profile) {
      setDepartment(profile.department || "");
      setDesignation(profile.designation || "");
      setEmployeeId(profile.employee_id || "");
      setExperienceYears(profile.experience_years || 5);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      apiClient<TraineeProfile>("/users/profile/trainee", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainee-profile"] });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      department,
      designation,
      employee_id: employeeId,
      experience_years: Number(experienceYears),
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-gov-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
          Trainee Officer Profile
        </h1>
        <p className="text-xs text-gov-slate-600">
          Manage your departmental designation, official ID, and institutional credentials.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gov-slate-200 shadow-sm space-y-6">
        {/* Account Header */}
        <div className="flex items-center gap-4 border-b border-gov-slate-100 pb-5">
          <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-bold text-xl flex items-center justify-center border-2 border-emerald-400">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="font-extrabold text-base text-gov-navy">{user?.full_name}</h2>
            <div className="text-xs text-gov-slate-500">{user?.email}</div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
              Role: {user?.role} (Active)
            </span>
          </div>
        </div>

        {isSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile successfully updated in the central registry!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
                Department / Wing
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Network Security Division"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
                Designation / Title
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Assistant Director"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
                Official Employee / Officer ID
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. DOT-2024-884"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
                Experience in Public Sector: {experienceYears} Years
              </label>
              <input
                type="range"
                min="0"
                max="35"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full accent-emerald-600 mt-2"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gov-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? "Saving..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
