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
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#12355B] tracking-tight">
          Instructor Profile & Expertise
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Maintain your subject domain tags, pedagogical experience, and availability for institutional matching.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-6">
        <div className="flex items-center gap-4 border-b border-[#E2E8F0] pb-5">
          <div className="w-13 h-13 rounded-xl bg-[#DFF5F3] text-[#12355B] font-bold text-xl flex items-center justify-center border border-[#00A6A6]/20">
            {user?.full_name?.charAt(0) || "T"}
          </div>
          <div>
            <h2 className="font-bold text-base text-[#12355B]">{user?.full_name}</h2>
            <div className="text-xs text-[#64748B] font-mono">{user?.email}</div>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F8F0] text-[#16875D] border border-[#16875D]/20 uppercase">
              Accreditation: Certified Trainer ({user?.status})
            </span>
          </div>
        </div>

        {isSuccess && (
          <div className="p-3 rounded-lg bg-[#E8F8F0] border border-[#16875D]/30 text-[#16875D] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16875D]" />
            <span>Profile and expertise tags updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
              Expertise Subjects (Used in Competency Matching Algorithm)
            </label>
            <input
              type="text"
              required
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="e.g. Cybersecurity in Governance, Critical Infrastructure Protection, ISO 27001"
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] font-medium text-[#172B4D] bg-[#F7F9FC]"
            />
            <p className="text-[11px] text-[#64748B] mt-1">
              Separate subjects by commas for the deterministic match formula.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
              Instructional Experience: {experienceYears} Years
            </label>
            <input
              type="range"
              min="1"
              max="35"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full accent-[#1769AA]"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-[#12355B]">Availability for Institutional Deployment</div>
              <div className="text-[11px] text-[#64748B]">Allow government departments to match and assign capacity workshops.</div>
            </div>
            <input
              type="checkbox"
              checked={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.checked)}
              className="w-4 h-4 accent-[#1769AA] rounded"
            />
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition flex items-center gap-2"
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
