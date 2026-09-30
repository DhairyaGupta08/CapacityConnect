"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Category, Course, PaginatedResponse } from "@/types/api";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  Layers,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export default function CourseCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => apiClient<Category[]>("/courses/categories"),
  });

  // Fetch courses with filters
  const { data: coursesData, isLoading } = useQuery<PaginatedResponse<Course>>({
    queryKey: ["courses", selectedCategory, selectedLevel, searchQuery, page],
    queryFn: () =>
      apiClient<PaginatedResponse<Course>>("/courses", {
        params: {
          category: selectedCategory || undefined,
          level: selectedLevel || undefined,
          q: searchQuery || undefined,
          page,
          page_size: 9,
        },
      }),
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F7F9FC]">
      {/* Header Banner */}
      <div className="bg-[#12355B] text-white p-8 rounded-xl border border-[#1D4B7D] shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D4B7D] text-[#00A6A6] text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Accredited Curriculum Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          National Course Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Standardized learning modules covering cybersecurity, digital public infrastructure, AI ethics,
          and public governance. Each course includes timed MCQ assessments and verified digital certification.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by course title, keywords, or directives..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#1769AA] text-[#172B4D] placeholder-[#64748B]"
          />
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#1769AA] text-[#172B4D] bg-white"
          >
            <option value="">All Domain Categories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Level Dropdown */}
        <div className="md:col-span-3">
          <select
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#1769AA] text-[#172B4D] bg-white"
          >
            <option value="">All Difficulty Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-xl bg-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : coursesData?.items.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F7F9FC] flex items-center justify-center mx-auto text-[#64748B]">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#12355B]">No courses matched your filters</h3>
          <p className="text-xs text-[#64748B]">Try clearing your search query or selecting a different category.</p>
          <button
            onClick={() => {
              setSelectedCategory("");
              setSelectedLevel("");
              setSearchQuery("");
            }}
            className="px-4 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#135488] text-white font-semibold text-xs transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData?.items.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#DFF5F3] text-[#12355B]">
                    {course.category_name || "Governance"}
                  </span>
                  <span className="text-[11px] font-medium text-[#64748B] capitalize flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                    {course.estimated_hours} Hours
                  </span>
                </div>

                <h2 className="text-base font-bold text-[#12355B] group-hover:text-[#1769AA] transition leading-snug line-clamp-2">
                  <Link href={`/courses/${course.id}`}>{course.title}</Link>
                </h2>

                <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">
                  {course.short_description || course.description}
                </p>

                <div className="pt-3 flex items-center justify-between text-xs text-[#172B4D] border-t border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#12355B] text-white font-bold flex items-center justify-center text-[10px]">
                      {course.trainer_name ? course.trainer_name.charAt(0) : "I"}
                    </div>
                    <span className="truncate max-w-[140px] text-xs font-medium text-[#64748B]">{course.trainer_name || "Instructor"}</span>
                  </div>
                  <span className="font-semibold text-[#1769AA] bg-[#EBF3FB] px-2 py-0.5 rounded text-[11px]">
                    {course.modules?.length || 3} Modules
                  </span>
                </div>
              </div>

              <div className="px-6 py-3 bg-[#F7F9FC] border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-xs font-bold capitalize text-[#12355B]">
                  Level: <span className="font-normal text-[#64748B]">{course.level}</span>
                </span>
                <Link
                  href={`/courses/${course.id}`}
                  className="px-4 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#135488] text-white font-semibold text-xs transition flex items-center gap-1 shadow-sm"
                >
                  Curriculum & Enroll
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

