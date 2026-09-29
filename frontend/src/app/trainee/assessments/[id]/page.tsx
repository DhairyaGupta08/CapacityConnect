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
        <div className="text-gov-navy font-bold text-sm animate-pulse">Loading timed assessment...</div>
      </div>
    );
  }

  if (isError || !assessment) {
    return (
      <div className="flex-1 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-gov-navy">No Assessment Configured</h2>
        <p className="text-xs text-gov-slate-500">The instructor has not published an assessment for this course yet.</p>
        <Link href={`/trainee/courses/${courseId}/learn`} className="text-xs font-bold text-emerald-600 hover:underline">
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
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Result Header Banner */}
        <div className={`p-8 rounded-2xl border text-white shadow-lg space-y-4 ${
          result.passed
            ? "bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 border-emerald-500/40"
            : "bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 border-rose-500/40"
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0">
                {result.passed ? <Award className="w-8 h-8 text-emerald-300" /> : <XCircle className="w-8 h-8 text-rose-300" />}
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                  Assessment Evaluation Complete
                </span>
                <h1 className="text-2xl font-black text-white">
                  {result.passed ? "Congratulations! You Passed" : "Passing Threshold Not Met"}
                </h1>
              </div>
            </div>

            <div className="text-right bg-black/20 px-5 py-3 rounded-xl border border-white/10">
              <div className="text-[11px] text-gov-slate-300 uppercase font-bold">Your Score</div>
              <div className="text-3xl font-black tracking-tight text-white">{result.percentage}%</div>
            </div>
          </div>

          {result.passed && result.certificate_code && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-400/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Official Certificate Auto-Issued!
                </div>
                <div className="text-[11px] text-gov-slate-300">
                  Verification Code: <span className="font-mono font-bold text-white">{result.certificate_code}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/verify/${result.certificate_code}`}
                  className="px-4 py-2 rounded-lg bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition shadow-sm"
                >
                  View Public Seal & PDF
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Question-by-Question Detailed Analysis */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gov-slate-200 shadow-sm space-y-6">
          <div className="border-b border-gov-slate-100 pb-4">
            <h2 className="text-lg font-bold text-gov-navy">
              Question Breakdown & Explanations ({result.question_breakdown.length})
            </h2>
            <p className="text-xs text-gov-slate-500">Review correct answers and regulatory justifications.</p>
          </div>

          <div className="space-y-6">
            {result.question_breakdown.map((item, idx) => (
              <div
                key={item.question_id}
                className={`p-5 rounded-xl border space-y-3 ${
                  item.is_correct ? "border-emerald-200 bg-emerald-50/30" : "border-rose-200 bg-rose-50/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-bold text-xs sm:text-sm text-gov-navy flex items-start gap-2">
                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${
                      item.is_correct ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                    }`}>
                      {idx + 1}
                    </span>
                    <span>{item.question_text}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                    item.is_correct ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}>
                    {item.marks_awarded} / {item.max_marks} Marks
                  </span>
                </div>

                {/* Options List */}
                <div className="space-y-2 pl-8">
                  {item.options.map((opt) => {
                    const isUserChoice = item.user_answers.includes(opt.id);
                    const isCorrectAnswer = item.correct_answers.includes(opt.id);

                    let optStyle = "border-gov-slate-200 bg-white text-gov-slate-700";
                    if (isCorrectAnswer) {
                      optStyle = "border-emerald-500 bg-emerald-100/60 text-emerald-950 font-bold";
                    } else if (isUserChoice && !isCorrectAnswer) {
                      optStyle = "border-rose-400 bg-rose-100/60 text-rose-950 font-bold";
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
                          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-200/70 px-2 py-0.5 rounded">
                            Correct Key
                          </span>
                        )}
                        {isUserChoice && !isCorrectAnswer && (
                          <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-200/70 px-2 py-0.5 rounded">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {item.explanation && (
                  <div className="ml-8 p-3 rounded-lg bg-gov-slate-100 border border-gov-slate-200 text-xs text-gov-slate-700 space-y-1">
                    <span className="font-bold text-gov-navy block">Explanation:</span>
                    <p className="leading-relaxed">{item.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gov-slate-100 flex justify-between items-center">
            <Link
              href={`/trainee/courses/${courseId}/learn`}
              className="px-4 py-2 rounded-lg bg-gov-navy text-white font-bold text-xs hover:bg-gov-navy-dark transition"
            >
              Back to Course Player
            </Link>
            {result.passed && result.certificate_code && (
              <Link
                href={`/verify/${result.certificate_code}`}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
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
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gov-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-20 z-30">
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Official Certification Exam
          </div>
          <h1 className="text-base sm:text-lg font-bold text-gov-navy">{assessment.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Countdown Clock */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gov-navy text-white text-xs font-mono font-bold shadow-inner">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{timeFormatted}</span>
          </div>

          <button
            onClick={handleFinalSubmit}
            disabled={submitMutation.isPending}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            {submitMutation.isPending ? "Grading..." : "Submit Exam"}
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Question Card and Jumper Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Question Area */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gov-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gov-slate-100 pb-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-xs text-gov-slate-500 font-semibold">
              {currentQ.marks} Marks
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm sm:text-base font-extrabold text-gov-navy leading-relaxed">
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
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-3 transition ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20 shadow-sm"
                        : "border-gov-slate-200 hover:bg-gov-slate-50 text-gov-slate-800"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? "bg-emerald-600 text-white" : "bg-gov-slate-100 text-gov-slate-700"
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
          <div className="pt-6 border-t border-gov-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-lg border border-gov-slate-200 disabled:opacity-30 text-xs font-semibold text-gov-slate-700 hover:bg-gov-slate-50 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                Next Question <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitMutation.isPending}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                Finish & Submit Exam <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Navigator */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gov-slate-200 shadow-sm space-y-4">
          <div className="border-b border-gov-slate-100 pb-3">
            <h3 className="font-bold text-xs text-gov-navy uppercase tracking-wider">
              Question Navigator
            </h3>
            <p className="text-[11px] text-gov-slate-500">
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
                  className={`h-10 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                    isCurrent
                      ? "ring-2 ring-emerald-500 bg-gov-navy text-white shadow-sm"
                      : isAnswered
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      : "bg-gov-slate-100 text-gov-slate-600 hover:bg-gov-slate-200"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gov-slate-100 text-[11px] text-gov-slate-500 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></span>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-gov-slate-100"></span>
              <span>Unanswered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
