"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/lib/authContext";
import type { TrainerProfile } from "@/types/api";
import {
  CheckCircle2,
  GraduationCap,
  Save,
  Shield,
  User,
} from "lucide-react";

export default function TrainerProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery<TrainerProfile>({
    queryKey: ["trainer-profile"],
    queryFn: () => apiClient<TrainerProfile>("/users/profile/trainer"),
  });

  const [expertise, setExpertise] = useState("");
  const [experienceYears, setExperienceYears] = useState(10);
  const [availabilityStatus, setAvailabilityStatus] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setExpertise((profile.expertise_subjects || []).join(", "));
      setExperienceYears(profile.experience_years || 10);
      setAvailabilityStatus(profile.availability_status ?? true);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      apiClient<TrainerProfile>("/users/profile/trainer", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-profile"] });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      expertise_subjects: expertise.split(",").map((s) => s.trim()).filter(Boolean),
      experience_years: Number(experienceYears),
      availability_status: availabilityStatus,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-gov-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
          Instructor Profile & Expertise
        </h1>
        <p className="text-xs text-gov-slate-600">
          Maintain your subject domain tags, pedagogical experience, and availability for institutional matching.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gov-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-gov-slate-100 pb-5">
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center border-2 border-blue-400">
            {user?.full_name?.charAt(0) || "T"}
          </div>
          <div>
            <h2 className="font-extrabold text-base text-gov-navy">{user?.full_name}</h2>
            <div className="text-xs text-gov-slate-500">{user?.email}</div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              Accreditation: Certified Trainer ({user?.status})
            </span>
          </div>
        </div>

        {isSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and expertise tags updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
              Expertise Subjects (Used in Competency Matching Algorithm)
            </label>
            <input
              type="text"
              required
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="e.g. Cybersecurity in Governance, Critical Infrastructure Protection, ISO 27001"
              className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-blue-500 font-medium text-gov-navy"
            />
            <p className="text-[11px] text-gov-slate-500 mt-1">
              Separate subjects by commas for the deterministic match formula.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
              Instructional Experience: {experienceYears} Years
            </label>
            <input
              type="range"
              min="1"
              max="35"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="p-4 rounded-xl bg-gov-slate-50 border border-gov-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-gov-navy">Availability for Institutional Deployment</div>
              <div className="text-[11px] text-gov-slate-500">Allow government departments to match and book you for capacity workshops.</div>
            </div>
            <input
              type="checkbox"
              checked={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 rounded"
            />
          </div>

          <div className="pt-4 border-t border-gov-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? "Saving..." : "Save Trainer Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
