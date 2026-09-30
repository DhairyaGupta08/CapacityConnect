"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type {
  CompetencyMatchResponse,
  CompetencyRequirement,
  SkillRequirement,
} from "@/types/api";
import {
  AlertCircle,
  Award,
  BookOpen,
  Briefcase,
  Building,
  CheckCircle2,
  GraduationCap,
  Layers,
  Play,
  Plus,
  Shield,
  Sparkles,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";

export default function CompetencyMatchingStudioPage() {
  const [selectedReqId, setSelectedReqId] = useState<string>("");

  // Requirement creation form states
  const [title, setTitle] = useState("National Cyber Threat Defense Lead Instructor");
  const [targetRole, setTargetRole] = useState("Chief Information Security Trainer");
  const [department, setDepartment] = useState("National Cyber Security Division");
  const [minExp, setMinExp] = useState(8.0);
  const [minQual, setMinQual] = useState("Master");
  const [subjects, setSubjects] = useState("Cybersecurity in Governance, Critical Infrastructure Protection");

  const [skills, setSkills] = useState<SkillRequirement[]>([
    { name: "Cybersecurity & Incident Response", min_level: 5, weight: 5 },
    { name: "Threat Modeling", min_level: 4, weight: 4 },
    { name: "Security Auditing & Compliance", min_level: 4, weight: 3 },
  ]);

  // Fetch list of requirements
  const { data: requirements, refetch: refetchReqs } = useQuery<CompetencyRequirement[]>({
    queryKey: ["competency-requirements"],
    queryFn: () => apiClient<CompetencyRequirement[]>("/competency/requirements"),
  });

  // Query for matching evaluation on selected requirement
  const {
    data: matchData,
    refetch: runMatch,
    isFetching: isMatching,
  } = useQuery<CompetencyMatchResponse>({
    queryKey: ["competency-match", selectedReqId],
    queryFn: () => apiClient<CompetencyMatchResponse>(`/competency/requirements/${selectedReqId}/match`),
    enabled: Boolean(selectedReqId),
  });

  // Create requirement mutation
  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      apiClient<CompetencyRequirement>("/competency/requirements", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (newReq) => {
      refetchReqs();
      setSelectedReqId(newReq.id);
    },
  });

  const handleAddSkill = () => {
    setSkills([...skills, { name: "", min_level: 3, weight: 3 }]);
  };

  const handleCreateAndMatch = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      target_role: targetRole,
      department,
      min_experience_years: Number(minExp),
      min_qualification: minQual,
      required_subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
      required_skills: skills.filter((s) => s.name.trim().length > 0),
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF5F3] text-[#12355B] text-xs font-semibold border border-[#00A6A6]/20">
          <Layers className="w-3.5 h-3.5 text-[#00A6A6]" />
          <span>Deterministic Competency Matching Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#12355B]">
          Institutional Capacity Matching Studio
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
          Define institutional competency requirements with weighted skill importance. The engine applies an
          explainable, mathematical matching formula across the accredited trainer registry to identify the best candidates.
        </p>
      </div>

      {/* Formula Explanation Banner */}
      <div className="bg-[#DFF5F3]/50 p-4 sm:p-5 rounded-xl border border-[#00A6A6]/30 shadow-sm space-y-2">
        <div className="flex items-center gap-2 font-bold text-xs text-[#12355B]">
          <Sparkles className="w-4 h-4 text-[#00A6A6]" />
          <span>Deterministic Matching Formula (SIH26075 Governance Standard)</span>
        </div>
        <div className="font-mono text-xs text-[#12355B] bg-white p-3 rounded-lg border border-[#E2E8F0] overflow-x-auto shadow-sm">
          Score = 100 × ( 0.40·S_skill + 0.20·S_subject + 0.15·S_proficiency + 0.15·S_experience + 0.10·S_qualification )
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Requirement Authoring Form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-5">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#12355B]">
              1. Define Competency Requirement Profile
            </h2>
            <p className="text-xs text-[#64748B]">Configure target department and required skill matrix.</p>
          </div>

          <form onSubmit={handleCreateAndMatch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                Requirement Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] font-medium text-[#172B4D] bg-[#F7F9FC]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                  Target Role / Designation
                </label>
                <input
                  type="text"
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] text-[#172B4D] bg-[#F7F9FC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                  Department / Ministry
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] text-[#172B4D] bg-[#F7F9FC]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                  Min. Experience: {minExp} Years
                </label>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={minExp}
                  onChange={(e) => setMinExp(Number(e.target.value))}
                  className="w-full accent-[#1769AA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                  Min. Qualification Level
                </label>
                <select
                  value={minQual}
                  onChange={(e) => setMinQual(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] bg-[#F7F9FC] text-[#172B4D]"
                >
                  <option value="Bachelor">Bachelor Degree</option>
                  <option value="Master">Master Degree</option>
                  <option value="PhD">Doctorate / Ph.D.</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                Required Subject Domains (Comma-separated)
              </label>
              <input
                type="text"
                required
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] text-[#172B4D] bg-[#F7F9FC]"
              />
            </div>

            {/* Required Skills Matrix */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider">
                  Required Skills & Importance Weights (1-5)
                </label>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="text-xs font-semibold text-[#1769AA] hover:text-[#12355B] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              </div>

              <div className="space-y-2.5">
                {skills.map((s, idx) => (
                  <div key={idx} className="p-3 bg-[#F7F9FC] rounded-lg border border-[#E2E8F0] space-y-2">
                    <input
                      type="text"
                      required
                      value={s.name}
                      onChange={(e) => {
                        const next = [...skills];
                        next[idx].name = e.target.value;
                        setSkills(next);
                      }}
                      placeholder="e.g. Cybersecurity & Incident Response"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] bg-white text-[#172B4D]"
                    />

                    <div className="grid grid-cols-2 gap-4 text-[11px] text-[#64748B]">
                      <div>
                        <span>Target Level (1-5): <b className="text-[#172B4D]">{s.min_level}</b></span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={s.min_level}
                          onChange={(e) => {
                            const next = [...skills];
                            next[idx].min_level = Number(e.target.value);
                            setSkills(next);
                          }}
                          className="w-full accent-[#1769AA]"
                        />
                      </div>
                      <div>
                        <span>Weight Importance (1-5): <b className="text-[#172B4D]">{s.weight}</b></span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={s.weight}
                          onChange={(e) => {
                            const next = [...skills];
                            next[idx].weight = Number(e.target.value);
                            setSkills(next);
                          }}
                          className="w-full accent-[#00A6A6]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0]">
              <button
                type="submit"
                disabled={createMutation.isPending || isMatching}
                className="w-full py-2.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                {createMutation.isPending || isMatching ? "Computing Match Scores..." : "Run Deterministic Matching Algorithm"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Ranked Matching Results with Explainability */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#12355B]">
                  2. Ranked Candidate Recommendations
                </h2>
                <p className="text-xs text-[#64748B]">
                  {matchData ? `${matchData.total_candidates_evaluated} candidates evaluated against deterministic criteria` : "Run algorithm to view ranked candidates"}
                </p>
              </div>
            </div>

            {isMatching ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-3 border-[#1769AA] border-t-transparent animate-spin mx-auto"></div>
                <div className="font-semibold text-xs text-[#12355B]">Evaluating formula components across registry...</div>
              </div>
            ) : matchData?.ranked_trainers.length ? (
              <div className="space-y-4">
                {matchData.ranked_trainers.map((candidate) => (
                  <div
                    key={candidate.trainer_id}
                    className={`p-4 sm:p-5 rounded-xl border transition space-y-3.5 ${
                      candidate.rank === 1
                        ? "border-[#00A6A6] bg-[#DFF5F3]/30 shadow-sm"
                        : "border-[#E2E8F0] bg-white"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                          candidate.rank === 1
                            ? "bg-[#00A6A6] text-white shadow-sm"
                            : "bg-[#F7F9FC] border border-[#E2E8F0] text-[#12355B]"
                        }`}>
                          #{candidate.rank}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#12355B]">{candidate.trainer_name}</div>
                          <div className="text-[11px] text-[#64748B]">{candidate.organization || "Accredited Instructor"}</div>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="text-right">
                        <div className="text-[10px] text-[#64748B] uppercase font-semibold">Match Score</div>
                        <div className="text-lg font-bold text-[#16875D] tracking-tight">
                          {candidate.total_score}<span className="text-xs font-normal text-[#64748B]">/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Component Breakdown Bars */}
                    <div className="space-y-1.5 text-[11px] bg-[#F7F9FC] p-3 rounded-lg border border-[#E2E8F0]">
                      <div className="font-semibold text-[#12355B] text-[10px] uppercase tracking-wider mb-1">
                        Formula Component Breakdown
                      </div>

                      <div className="flex justify-between items-center text-[#64748B]">
                        <span>Skills Coverage (40%)</span>
                        <span className="font-semibold text-[#12355B]">{Math.round(candidate.breakdown.s_skill * 100)}%</span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#1769AA] h-1.5 rounded-full" style={{ width: `${candidate.breakdown.s_skill * 100}%` }}></div>
                      </div>

                      <div className="flex justify-between items-center text-[#64748B] pt-1">
                        <span>Subject Domain Overlap (20%)</span>
                        <span className="font-semibold text-[#12355B]">{Math.round(candidate.breakdown.s_subject * 100)}%</span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#00A6A6] h-1.5 rounded-full" style={{ width: `${candidate.breakdown.s_subject * 100}%` }}></div>
                      </div>

                      <div className="flex justify-between items-center text-[#64748B] pt-1">
                        <span>Experience Adequacy (15%)</span>
                        <span className="font-semibold text-[#12355B]">{candidate.experience_years} Years ({Math.round(candidate.breakdown.s_experience * 100)}%)</span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#16875D] h-1.5 rounded-full" style={{ width: `${candidate.breakdown.s_experience * 100}%` }}></div>
                      </div>
                    </div>

                    {/* Matched vs Missing Skills */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.matched_skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#E8F8F0] text-[#16875D] border border-[#16875D]/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-[#16875D]" /> {s}
                          </span>
                        ))}
                        {candidate.missing_skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FDF2F2] text-[#D64545] border border-[#D64545]/20">
                            Missing: {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Explainability Narrative */}
                    <div className="p-3 bg-white rounded-lg border border-[#E2E8F0] text-xs text-[#172B4D]">
                      <span className="font-semibold text-[#12355B] text-[11px] block mb-0.5">Auditable Justification:</span>
                      <p className="text-[#64748B] leading-relaxed">{candidate.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-[#64748B] text-xs space-y-2">
                <Layers className="w-8 h-8 text-[#64748B]/40 mx-auto" />
                <p>Click &quot;Run Deterministic Matching Algorithm&quot; to compute candidate rankings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
