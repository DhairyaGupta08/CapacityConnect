"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Assessment, AssessmentResult } from "@/types/api";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  GraduationCap,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export default function AssessmentTakePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // Fetch assessment by course ID
  const { data: assessment, isLoading, isError } = useQuery<Assessment>({
    queryKey: ["assessment", courseId],
    queryFn: () => apiClient<Assessment>(`/assessments/course/${courseId}`),
  });

  // Countdown timer
  useEffect(() => {
    if (result || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining, result]);

  // Submit attempt mutation
  const submitMutation = useMutation({
    mutationFn: (answersPayload: Record<string, string[]>) =>
      apiClient<AssessmentResult>(`/assessments/${assessment!.id}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers: answersPayload }),
      }),
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["my-certificates"] });
      queryClient.invalidateQueries({ queryKey: ["trainee-stats"] });
      queryClient.invalidateQueries({ queryKey: ["course-player", courseId] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-[#1769AA] border-t-transparent animate-spin"></div>
          <div className="text-[#12355B] font-semibold text-sm">Loading timed assessment...</div>
        </div>
      </div>
    );
  }

  if (isError || !assessment) {
    return (
      <div className="flex-1 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#FEF8E7] text-[#D89B18] flex items-center justify-center mx-auto border border-[#D89B18]/30">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#12355B]">No Assessment Configured</h2>
        <p className="text-xs text-[#64748B]">The instructor has not published an assessment for this course yet.</p>
        <Link href={`/trainee/courses/${courseId}/learn`} className="text-xs font-semibold text-[#1769AA] hover:underline">
          Return to Course Player
        </Link>
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQ = questions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (result) return;
    const qId = currentQ.id;
    // Single choice selection
    setAnswers((prev) => ({
      ...prev,
      [qId]: [optionId],
    }));
  };

  const handleFinalSubmit = () => {
    submitMutation.mutate(answers);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // If already submitted and result available, show detailed result analysis
  if (result) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Result Header Banner */}
        <div className={`p-6 sm:p-8 rounded-xl border shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4 ${
          result.passed
            ? "bg-[#E8F8F0] border-[#16875D]/30 text-[#12355B]"
            : "bg-[#FDF2F2] border-[#D64545]/30 text-[#12355B]"
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-13 h-13 rounded-xl flex items-center justify-center shrink-0 border ${
                result.passed
                  ? "bg-white border-[#16875D]/30 text-[#16875D]"
                  : "bg-white border-[#D64545]/30 text-[#D64545]"
              }`}>
                {result.passed ? <Award className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
              </div>
              <div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${result.passed ? "text-[#16875D]" : "text-[#D64545]"}`}>
                  Assessment Evaluation Complete
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#12355B]">
                  {result.passed ? "Congratulations! Examination Passed" : "Passing Threshold Not Met"}
                </h1>
              </div>
            </div>

            <div className="text-right bg-white px-5 py-3 rounded-lg border border-[#E2E8F0] shadow-sm">
              <div className="text-[11px] text-[#64748B] uppercase font-semibold">Your Score</div>
              <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${result.passed ? "text-[#16875D]" : "text-[#D64545]"}`}>
                {result.percentage}%
              </div>
            </div>
          </div>

          {result.passed && result.certificate_code && (
            <div className="p-4 rounded-lg bg-white border border-[#16875D]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-xs font-bold text-[#16875D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16875D]" />
                  Official Credential Auto-Issued!
                </div>
                <div className="text-xs text-[#64748B]">
                  Registry Serial: <span className="font-mono font-bold text-[#12355B]">{result.certificate_code}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/verify/${result.certificate_code}`}
                  className="px-4 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs transition shadow-sm"
                >
                  View Public Seal & PDF
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Question-by-Question Detailed Analysis */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-[#12355B]">
              Question Breakdown & Regulatory Explanations ({result.question_breakdown.length})
            </h2>
            <p className="text-xs text-[#64748B]">Review correct answer keys and administrative justifications.</p>
          </div>

          <div className="space-y-5">
            {result.question_breakdown.map((item, idx) => (
              <div
                key={item.question_id}
                className={`p-5 rounded-xl border space-y-3 ${
                  item.is_correct ? "border-[#16875D]/30 bg-[#E8F8F0]/30" : "border-[#D64545]/30 bg-[#FDF2F2]/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-bold text-xs sm:text-sm text-[#12355B] flex items-start gap-2.5">
                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${
                      item.is_correct ? "bg-[#16875D] text-white" : "bg-[#D64545] text-white"
                    }`}>
                      {idx + 1}
                    </span>
                    <span>{item.question_text}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                    item.is_correct ? "bg-[#E8F8F0] text-[#16875D] border border-[#16875D]/20" : "bg-[#FDF2F2] text-[#D64545] border border-[#D64545]/20"
                  }`}>
                    {item.marks_awarded} / {item.max_marks} Marks
                  </span>
                </div>

                {/* Options List */}
                <div className="space-y-2 pl-8">
                  {item.options.map((opt) => {
                    const isUserChoice = item.user_answers.includes(opt.id);
                    const isCorrectAnswer = item.correct_answers.includes(opt.id);

                    let optStyle = "border-[#E2E8F0] bg-white text-[#172B4D]";
                    if (isCorrectAnswer) {
                      optStyle = "border-[#16875D] bg-[#E8F8F0] text-[#12355B] font-semibold";
                    } else if (isUserChoice && !isCorrectAnswer) {
                      optStyle = "border-[#D64545] bg-[#FDF2F2] text-[#D64545] font-semibold";
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${optStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold uppercase">{opt.id}.</span>
                          <span>{opt.text}</span>
                        </div>
                        {isCorrectAnswer && (
                          <span className="text-[10px] uppercase font-semibold text-[#16875D] bg-white border border-[#16875D]/20 px-2 py-0.5 rounded">
                            Correct Key
                          </span>
                        )}
                        {isUserChoice && !isCorrectAnswer && (
                          <span className="text-[10px] uppercase font-semibold text-[#D64545] bg-white border border-[#D64545]/20 px-2 py-0.5 rounded">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {item.explanation && (
                  <div className="ml-8 p-3 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#172B4D] space-y-1">
                    <span className="font-semibold text-[#12355B] block">Regulatory Explanation:</span>
                    <p className="text-[#64748B] leading-relaxed">{item.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-between items-center">
            <Link
              href={`/trainee/courses/${courseId}/learn`}
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-[#12355B] font-semibold text-xs hover:bg-[#F7F9FC] transition"
            >
              Back to Course Player
            </Link>
            {result.passed && result.certificate_code && (
              <Link
                href={`/verify/${result.certificate_code}`}
                className="px-5 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs shadow-sm transition"
              >
                View Issued Certificate
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active Assessment Taking Screen
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Sticky Exam Top Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-20 z-30">
        <div className="space-y-0.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#00A6A6]">
            Official Certification Exam
          </div>
          <h1 className="text-base sm:text-lg font-bold text-[#12355B]">{assessment.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Countdown Clock */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#12355B] text-white text-xs font-mono font-semibold shadow-inner">
            <Clock className="w-4 h-4 text-[#00A6A6]" />
            <span>{timeFormatted}</span>
          </div>

          <button
            onClick={handleFinalSubmit}
            disabled={submitMutation.isPending}
            className="px-5 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            {submitMutation.isPending ? "Grading..." : "Submit Exam"}
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Question Card and Jumper Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Question Area */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <span className="text-xs font-semibold text-[#00A6A6] uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-xs text-[#64748B] font-medium">
              {currentQ.marks} Marks
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-[#12355B] leading-relaxed">
              {currentQ.question_text}
            </h2>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = (answers[currentQ.id] || []).includes(opt.id);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleOptionSelect(opt.id)}
                    className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm flex items-center gap-3 transition ${
                      isSelected
                        ? "border-[#1769AA] bg-[#DFF5F3] text-[#12355B] font-semibold ring-2 ring-[#1769AA]/20"
                        : "border-[#E2E8F0] hover:bg-[#F7F9FC] text-[#172B4D]"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? "bg-[#1769AA] text-white" : "bg-[#F7F9FC] border border-[#E2E8F0] text-[#64748B]"
                    }`}>
                      {opt.id}
                    </span>
                    <span className="flex-1 leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav Controls */}
          <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] disabled:opacity-30 text-xs font-semibold text-[#172B4D] hover:bg-[#F7F9FC] transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-lg bg-[#1769AA] hover:bg-[#12355B] text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                Next Question <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitMutation.isPending}
                className="px-6 py-2 rounded-lg bg-[#16875D] hover:bg-[#126b4a] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
              >
                Finish & Submit Exam <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Navigator */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="font-bold text-xs text-[#12355B] uppercase tracking-wider">
              Question Navigator
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Answered: {Object.keys(answers).length} / {questions.length}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(answers[q.id]?.length);
              const isCurrent = idx === currentQuestionIndex;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-9 rounded-lg font-semibold text-xs flex items-center justify-center transition ${
                    isCurrent
                      ? "ring-2 ring-[#1769AA] bg-[#12355B] text-white shadow-sm"
                      : isAnswered
                      ? "bg-[#DFF5F3] text-[#12355B] border border-[#00A6A6]/30"
                      : "bg-[#F7F9FC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#E2E8F0]"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] text-[11px] text-[#64748B] space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#DFF5F3] border border-[#00A6A6]/30"></span>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#F7F9FC] border border-[#E2E8F0]"></span>
              <span>Unanswered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
