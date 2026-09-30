"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Category, Course } from "@/types/api";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, PlusCircle, Save } from "lucide-react";

export default function CreateCoursePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [estimatedHours, setEstimatedHours] = useState(3.0);
  const [errorMsg, setErrorMsg] = useState("");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => apiClient<Category[]>("/courses/categories"),
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      apiClient<Course>("/courses", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (newCourse) => {
      queryClient.invalidateQueries({ queryKey: ["trainer-courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      router.push(`/courses/${newCourse.id}`);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to create course.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    createMutation.mutate({
      title,
      short_description: shortDescription,
      description,
      category_id: categoryId || (categories && categories[0]?.id),
      level,
      estimated_hours: Number(estimatedHours),
      status: "published",
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-4">
        <Link
          href="/trainer/courses"
          className="p-2 rounded-lg hover:bg-[#F7F9FC] text-[#12355B] transition border border-[#E2E8F0]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#12355B] tracking-tight">
            Course Creator Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Publish an accredited institutional training curriculum for civil servants.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(18,53,91,0.06)] space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-[#FDF2F2] border border-[#D64545]/20 text-[#D64545] text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
              Course Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zero Trust Architecture for Critical Government IT Infrastructure"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] font-medium text-[#172B4D] bg-[#F7F9FC]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
                Domain Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] bg-[#F7F9FC] text-[#172B4D]"
              >
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
                Difficulty Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] bg-[#F7F9FC] text-[#172B4D]"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
              Short Description (Teaser)
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Essential zero trust principles, identity verification, and perimeter defense."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] text-[#172B4D] bg-[#F7F9FC]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
              Complete Course Curriculum & Guidelines
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description covering learning outcomes, prerequisites, and directives..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] text-[#172B4D] bg-[#F7F9FC] leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1.5">
              Estimated Completion Duration: {estimatedHours} Hours
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full accent-[#1769AA]"
            />
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Link
              href="/trainer/courses"
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:bg-[#F7F9FC] transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2.5 rounded-lg bg-[#1769AA] hover:bg-[#12355B] disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {createMutation.isPending ? "Publishing..." : "Publish Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
