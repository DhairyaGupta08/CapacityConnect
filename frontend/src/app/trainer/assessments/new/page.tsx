"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/lib/authContext";
import type { Course, PaginatedResponse } from "@/types/api";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  CheckSquare,
  Clock,
  Plus,
  PlusCircle,
  Save,
  Trash2,
} from "lucide-react";

interface QuestionDraft {
  question_text: string;
  options: { id: string; text: string }[];
  correct_answers: string[];
  explanation: string;
  marks: number;
}

export default function CreateAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams.get("course_id");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [courseId, setCourseId] = useState(preselectedCourseId || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(15);
  const [passingPercentage, setPassingPercentage] = useState(70.0);
  const [errorMsg, setErrorMsg] = useState("");

  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      question_text: "Under standard CERT-In directives, what is the mandatory reporting window for cyber incidents?",
      options: [
        { id: "A", text: "Within 24 hours of confirmation" },
        { id: "B", text: "Within 6 hours of noticing" },
        { id: "C", text: "Within 48 hours during business days" },
        { id: "D", text: "Within 7 days of resolution" },
      ],
      correct_answers: ["B"],
      explanation: "CERT-In directions require reportable cybersecurity incidents to be communicated within 6 hours.",
      marks: 25,
    },
    {
      question_text: "What is the mandatory log retention period prescribed for government ICT systems?",
      options: [
        { id: "A", text: "30 days" },
        { id: "B", text: "90 days" },
        { id: "C", text: "180 days" },
        { id: "D", text: "365 days" },
      ],
      correct_answers: ["C"],
      explanation: "ICT logs must be securely retained for 180 days within sovereign Indian jurisdiction.",
      marks: 25,
    },
  ]);

  // Fetch trainer's courses
  const { data: coursesData } = useQuery<PaginatedResponse<Course>>({
    queryKey: ["trainer-courses-select", user?.id],
    queryFn: () => apiClient<PaginatedResponse<Course>>(`/courses?trainer_id=${user?.id}`),
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      apiClient("/assessments", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-courses"] });
      router.push("/trainer/dashboard");
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to create assessment.");
    },
  });

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        options: [
          { id: "A", text: "" },
          { id: "B", text: "" },
          { id: "C", text: "" },
          { id: "D", text: "" },
        ],
        correct_answers: ["A"],
        explanation: "",
        marks: 25,
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const targetCourseId = courseId || coursesData?.items[0]?.id;
    if (!targetCourseId) {
      setErrorMsg("Please select a target course for this assessment.");
      return;
    }

    createMutation.mutate({
      course_id: targetCourseId,
      title: title || "Course Certification Assessment",
      description,
      time_limit_minutes: Number(timeLimit),
      passing_percentage: Number(passingPercentage),
      total_marks: questions.reduce((sum, q) => sum + q.marks, 0),
      questions: questions.map((q, idx) => ({
        question_text: q.question_text,
        question_type: "single_choice",
        marks: q.marks,
        sequence_order: idx + 1,
        options: q.options,
        correct_answers: q.correct_answers,
        explanation: q.explanation,
      })),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-4">
        <Link
          href="/trainer/dashboard"
          className="p-2 rounded-lg hover:bg-[#F7F9FC] text-[#12355B] transition border border-[#E2E8F0]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#12355B] tracking-tight">
            MCQ Assessment Authoring Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Define timed exam parameters, author multiple choice questions, and set passing criteria.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-[#FDF2F2] border border-[#D64545]/20 text-[#D64545] text-xs">
            {errorMsg}
          </div>
        )}

        {/* Exam General Parameters */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4">
          <h2 className="text-sm font-bold text-[#12355B] border-b border-[#E2E8F0] pb-2">
            Exam Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
                Target Course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] bg-[#F7F9FC] text-[#172B4D]"
              >
                {coursesData?.items.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
                Assessment Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Official Certification Assessment"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] bg-[#F7F9FC] text-[#172B4D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
                Time Limit: {timeLimit} Minutes
              </label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full accent-[#1769AA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
                Passing Score Percentage: {passingPercentage}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(Number(e.target.value))}
                className="w-full accent-[#00A6A6]"
              />
            </div>
          </div>
        </div>

        {/* Questions Authoring List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#12355B]">
              Exam Questions ({questions.length})
            </h2>
            <button
              type="button"
              onClick={addQuestion}
              className="px-3.5 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>

          {questions.map((q, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-xs font-bold text-[#12355B]">
                  Question {idx + 1}
                </span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    className="text-[#D64545] hover:underline text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                  Question Text
                </label>
                <input
                  type="text"
                  required
                  value={q.question_text}
                  onChange={(e) => {
                    const next = [...questions];
                    next[idx].question_text = e.target.value;
                    setQuestions(next);
                  }}
                  placeholder="Enter the question premise..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] bg-[#F7F9FC] text-[#172B4D]"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider">
                  Options & Correct Key
                </label>
                {q.options.map((opt, optIdx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...questions];
                        next[idx].correct_answers = [opt.id];
                        setQuestions(next);
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition ${
                        q.correct_answers.includes(opt.id)
                          ? "bg-[#16875D] text-white shadow-sm"
                          : "bg-[#F7F9FC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#E2E8F0]"
                      }`}
                      title="Click to set as correct answer"
                    >
                      {opt.id}
                    </button>
                    <input
                      type="text"
                      required
                      value={opt.text}
                      onChange={(e) => {
                        const next = [...questions];
                        next[idx].options[optIdx].text = e.target.value;
                        setQuestions(next);
                      }}
                      placeholder={`Option ${opt.id} text...`}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] bg-[#F7F9FC] text-[#172B4D]"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                  Regulatory Explanation (Shown to trainee post-submission)
                </label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) => {
                    const next = [...questions];
                    next[idx].explanation = e.target.value;
                    setQuestions(next);
                  }}
                  placeholder="Justification citing CERT-In guidelines, IT Act, or architecture manual..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] bg-[#F7F9FC] text-[#172B4D]"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Link
            href="/trainer/dashboard"
            className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:bg-[#F7F9FC] transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-6 py-2.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            {createMutation.isPending ? "Saving..." : "Publish Assessment"}
          </button>
        </div>
      </form>
    </div>
  );
}
