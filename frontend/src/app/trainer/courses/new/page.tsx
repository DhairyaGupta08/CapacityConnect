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
      <div className="flex items-center gap-3 border-b border-gov-slate-200 pb-4">
        <Link
          href="/trainer/courses"
          className="p-2 rounded-lg hover:bg-gov-slate-200 text-gov-navy transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
            Course Creator Studio
          </h1>
          <p className="text-xs text-gov-slate-600">
            Publish an accredited institutional training curriculum for civil servants.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gov-slate-200 shadow-sm space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
              Course Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zero Trust Architecture for Critical Government IT Infrastructure"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-gov-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-medium text-gov-navy"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
                Domain Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
              >
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
                Difficulty Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
              Short Description (Teaser)
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Essential zero trust principles, identity verification, and perimeter defense."
              className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
              Complete Course Curriculum & Guidelines
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description covering learning outcomes, prerequisites, and directives..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500 leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
              Estimated Completion Duration: {estimatedHours} Hours
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div className="pt-4 border-t border-gov-slate-100 flex justify-end gap-3">
            <Link
              href="/trainer/courses"
              className="px-4 py-2 rounded-lg border border-gov-slate-200 text-xs font-bold text-gov-slate-600 hover:bg-gov-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
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
