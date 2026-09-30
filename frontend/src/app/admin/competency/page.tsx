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
  Cpu,
  GraduationCap,
  HelpCircle,
  Layers,
  Play,
  Plus,
  Shield,
  Sliders,
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
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-gov-navy-dark via-gov-navy to-gov-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-gov-navy-light/40 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
          <Layers className="w-3.5 h-3.5" />
          <span>Deterministic Competency Matching Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Institutional Capacity Matching Studio
        </h1>
        <p className="text-xs sm:text-sm text-gov-slate-300 max-w-3xl leading-relaxed">
          Define institutional competency requirements with weighted skill importance. The engine applies an
          explainable, mathematical matching formula across the accredited trainer registry to identify the best candidates.
        </p>
      </div>

      {/* Formula Explanation Banner */}
      <div className="bg-white p-5 rounded-2xl border border-gov-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 font-bold text-xs text-gov-navy">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Deterministic Matching Formula (SIH26075 Governance Standard)</span>
        </div>
        <div className="font-mono text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 overflow-x-auto">
          Score = 100 × ( 0.40·S_skill + 0.20·S_subject + 0.15·S_proficiency + 0.15·S_experience + 0.10·S_qualification )
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Requirement Authoring Form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-gov-slate-200 shadow-sm space-y-6">
          <div className="border-b border-gov-slate-100 pb-3">
            <h2 className="text-base font-bold text-gov-navy">
              1. Define Competency Requirement Profile
            </h2>
            <p className="text-xs text-gov-slate-500">Configure target department and required skill matrix.</p>
          </div>

          <form onSubmit={handleCreateAndMatch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                Requirement Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500 font-medium text-gov-navy"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                  Target Role / Designation
                </label>
                <input
                  type="text"
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                  Department / Ministry
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                  Min. Experience: {minExp} Years
                </label>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={minExp}
                  onChange={(e) => setMinExp(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                  Min. Qualification Level
                </label>
                <select
                  value={minQual}
                  onChange={(e) => setMinQual(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="Bachelor">Bachelor Degree</option>
                  <option value="Master">Master Degree</option>
                  <option value="PhD">Doctorate / Ph.D.</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                Required Subject Domains (Comma-separated)
              </label>
              <input
                type="text"
                required
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Required Skills Matrix */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider">
                  Required Skills & Importance Weights (1-5)
                </label>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              </div>

              <div className="space-y-2.5">
                {skills.map((s, idx) => (
                  <div key={idx} className="p-3 bg-gov-slate-50 rounded-xl border border-gov-slate-200 space-y-2">
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
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500"
                    />

                    <div className="grid grid-cols-2 gap-4 text-[11px] text-gov-slate-600">
                      <div>
                        <span>Target Level (1-5): <b>{s.min_level}</b></span>
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
                          className="w-full accent-blue-600"
                        />
                      </div>
                      <div>
                        <span>Weight Importance (1-5): <b>{s.weight}</b></span>
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
                          className="w-full accent-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gov-slate-100">
              <button
                type="submit"
                disabled={createMutation.isPending || isMatching}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                {createMutation.isPending || isMatching ? "Computing Match Scores..." : "Run Deterministic Matching Algorithm"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Ranked Matching Results with Explainability */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gov-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gov-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gov-navy">
                  2. Ranked Candidate Recommendations
                </h2>
                <p className="text-xs text-gov-slate-500">
                  {matchData ? `${matchData.total_candidates_evaluated} candidates evaluated against deterministic criteria` : "Run algorithm to view ranked candidates"}
                </p>
              </div>
            </div>

            {isMatching ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-10 h-10 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto"></div>
                <div className="font-bold text-xs text-gov-navy">Evaluating formula components across registry...</div>
              </div>
            ) : matchData?.ranked_trainers.length ? (
              <div className="space-y-5">
                {matchData.ranked_trainers.map((candidate) => (
                  <div
                    key={candidate.trainer_id}
                    className={`p-5 rounded-2xl border transition space-y-4 ${
                      candidate.rank === 1
                        ? "border-emerald-400 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 shadow-md ring-2 ring-emerald-500/20"
                        : "border-gov-slate-200 bg-white"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                          candidate.rank === 1
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-gov-slate-200 text-gov-navy"
                        }`}>
                          #{candidate.rank}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gov-navy">{candidate.trainer_name}</div>
                          <div className="text-[11px] text-gov-slate-500">{candidate.organization || "Accredited Instructor"}</div>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="text-right">
                        <div className="text-[10px] text-gov-slate-400 uppercase font-bold">Match Score</div>
                        <div className="text-xl font-black text-emerald-700 tracking-tight">
                          {candidate.total_score}<span className="text-xs font-bold text-gov-slate-400">/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Component Breakdown Bars */}
                    <div className="space-y-1.5 text-[11px] bg-white p-3.5 rounded-xl border border-gov-slate-200">
                      <div className="font-bold text-gov-navy text-[10px] uppercase tracking-wider mb-1">
                        Formula Component Breakdown
                      </div>

                      <div className="flex justify-between items-center text-gov-slate-600">
                        <span>Skills Coverage (40%)</span>
                        <span className="font-bold text-gov-navy">{Math.round(candidate.breakdown.s_skill * 100)}%</span>
                      </div>
                      <div className="w-full bg-gov-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${candidate.breakdown.s_skill * 100}%` }}></div>
                      </div>

                      <div className="flex justify-between items-center text-gov-slate-600 pt-1">
                        <span>Subject Domain Overlap (20%)</span>
                        <span className="font-bold text-gov-navy">{Math.round(candidate.breakdown.s_subject * 100)}%</span>
                      </div>
                      <div className="w-full bg-gov-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${candidate.breakdown.s_subject * 100}%` }}></div>
                      </div>

                      <div className="flex justify-between items-center text-gov-slate-600 pt-1">
                        <span>Experience Adequacy (15%)</span>
                        <span className="font-bold text-gov-navy">{candidate.experience_years} Years ({Math.round(candidate.breakdown.s_experience * 100)}%)</span>
                      </div>
                      <div className="w-full bg-gov-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${candidate.breakdown.s_experience * 100}%` }}></div>
                      </div>
                    </div>

                    {/* Matched vs Missing Skills */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.matched_skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {s}
                          </span>
                        ))}
                        {candidate.missing_skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Missing: {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Explainability Narrative */}
                    <div className="p-3 bg-gov-slate-50 rounded-xl border border-gov-slate-200 text-xs text-gov-slate-700">
                      <span className="font-bold text-gov-navy text-[11px] block mb-0.5">Auditable Justification:</span>
                      <p className="leading-relaxed">{candidate.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gov-slate-500 text-xs space-y-2">
                <Layers className="w-8 h-8 text-gov-slate-300 mx-auto" />
                <p>Click &quot;Run Deterministic Matching Algorithm&quot; to compute candidate rankings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
