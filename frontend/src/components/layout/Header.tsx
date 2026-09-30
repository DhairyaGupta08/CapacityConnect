"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Users,
  X,
} from "lucide-react";

export function Header() {
  const { user, logout, quickLogin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "trainer") return "/trainer/dashboard";
    return "/trainee/dashboard";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] shadow-sm">
      {/* 1. Subtle Institutional Top Strip */}
      <div className="bg-[#12355B] text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00A6A6]"></span>
            <span className="font-medium text-slate-200 tracking-normal text-[11px] sm:text-xs">
              National Digital Capacity Building & Accreditation Platform
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-300">
            <span className="text-slate-400">CBC / DoPT Institutional Framework</span>
            <span className="text-slate-600">|</span>
            <Link
              href="/verify"
              className="hover:text-white transition flex items-center gap-1.5 text-[#00A6A6] font-medium"
            >
              <Award className="w-3.5 h-3.5" /> Public Certificate Verification
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main White Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#12355B] flex items-center justify-center text-white border border-[#E2E8F0] shadow-sm group-hover:bg-[#1769AA] transition">
              <Shield className="w-5 h-5 text-[#00A6A6]" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight flex items-center gap-0.5 text-[#12355B]">
                Capacity<span className="text-[#1769AA]">Connect</span>
              </div>
              <div className="text-[10px] text-[#64748B] tracking-wider uppercase font-semibold">
                Digital Governance LMS
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/courses"
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                pathname.startsWith("/courses")
                  ? "bg-[#DFF5F3] text-[#12355B] font-bold"
                  : "text-[#172B4D] hover:text-[#1769AA] hover:bg-[#F7F9FC]"
              }`}
            >
              Course Catalog
            </Link>
            <Link
              href="/verify"
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                pathname.startsWith("/verify")
                  ? "bg-[#DFF5F3] text-[#12355B] font-bold"
                  : "text-[#172B4D] hover:text-[#1769AA] hover:bg-[#F7F9FC]"
              }`}
            >
              Verify Certificate
            </Link>
            {user && (
              <Link
                href={getDashboardLink()}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  pathname.includes("/dashboard")
                    ? "bg-[#DFF5F3] text-[#12355B] font-bold"
                    : "text-[#172B4D] hover:text-[#1769AA] hover:bg-[#F7F9FC]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#1769AA]" />
                {user.role === "admin" ? "Admin Portal" : user.role === "trainer" ? "Trainer Portal" : "My Learning"}
              </Link>
            )}
          </nav>
        </div>

        {/* Right Action Menu: Demo Quick Switcher, Auth & User Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] text-[#172B4D] text-xs font-semibold hover:bg-[#EBF3FB] hover:border-[#1769AA]/40 transition"
              title="Quickly switch demo accounts for judges and evaluators"
            >
              <Users className="w-3.5 h-3.5 text-[#1769AA]" />
              <span className="hidden sm:inline text-[#64748B]">Role Switcher:</span>
              <span className="capitalize text-[#12355B] font-bold">{user ? user.role : "Guest"}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-[#64748B]" />
            </button>

            {isDemoMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-[#E2E8F0] text-[#172B4D] shadow-lg py-2 z-50 text-xs"
                onMouseLeave={() => setIsDemoMenuOpen(false)}
              >
                <div className="px-3.5 py-1 text-[11px] font-bold text-[#12355B] uppercase tracking-wider border-b border-[#E2E8F0] pb-1.5 mb-1 flex items-center justify-between">
                  <span>Demo Fast-Switch</span>
                  <span className="text-[10px] text-[#00A6A6] font-semibold">1-Click Login</span>
                </div>
                <button
                  onClick={async () => {
                    setIsDemoMenuOpen(false);
                    await quickLogin("admin");
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-[#F7F9FC] flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-[#FEF8E7] text-[#D89B18] flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#12355B]">Admin (Governance)</div>
                      <div className="text-[10px] text-[#64748B]">Approvals, Competency & KPIs</div>
                    </div>
                  </div>
                  {user?.role === "admin" && <CheckCircle2 className="w-3.5 h-3.5 text-[#16875D]" />}
                </button>
                <button
                  onClick={async () => {
                    setIsDemoMenuOpen(false);
                    await quickLogin("trainer");
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-[#F7F9FC] flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-[#EBF3FB] text-[#1769AA] flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#12355B]">Trainer (Authoring)</div>
                      <div className="text-[10px] text-[#64748B]">Courses & MCQ Assessments</div>
                    </div>
                  </div>
                  {user?.role === "trainer" && <CheckCircle2 className="w-3.5 h-3.5 text-[#16875D]" />}
                </button>
                <button
                  onClick={async () => {
                    setIsDemoMenuOpen(false);
                    await quickLogin("trainee");
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-[#F7F9FC] flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-[#DFF5F3] text-[#00A6A6] flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#12355B]">Trainee (Learner)</div>
                      <div className="text-[10px] text-[#64748B]">Take test & get certified</div>
                    </div>
                  </div>
                  {user?.role === "trainee" && <CheckCircle2 className="w-3.5 h-3.5 text-[#16875D]" />}
                </button>
              </div>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F7F9FC] transition text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-[#12355B] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {user.full_name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="font-semibold text-xs text-[#12355B] leading-tight">{user.full_name}</div>
                  <div className="text-[10px] text-[#64748B] uppercase tracking-wider">{user.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#E2E8F0] text-[#172B4D] shadow-lg py-1.5 z-50 text-xs"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-[#E2E8F0]">
                    <div className="font-semibold text-[#12355B] truncate">{user.full_name}</div>
                    <div className="text-[11px] text-[#64748B] truncate">{user.email}</div>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F7F9FC] text-[#172B4D] transition font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#1769AA]" />
                    Dashboard
                  </Link>
                  {user.role === "trainee" && (
                    <Link
                      href="/trainee/certificates"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F7F9FC] text-[#172B4D] transition font-medium"
                    >
                      <Award className="w-4 h-4 text-[#00A6A6]" />
                      My Certificates
                    </Link>
                  )}
                  {user.role === "trainer" && (
                    <Link
                      href="/trainer/courses"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F7F9FC] text-[#172B4D] transition font-medium"
                    >
                      <BookOpen className="w-4 h-4 text-[#1769AA]" />
                      My Authored Courses
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      href="/admin/approvals"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F7F9FC] text-[#172B4D] transition font-medium"
                    >
                      <Shield className="w-4 h-4 text-[#1769AA]" />
                      Trainer Approvals
                    </Link>
                  )}
                  <div className="border-t border-[#E2E8F0] my-1"></div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-[#D64545] hover:bg-[#FDF2F2] transition font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#1769AA] border border-[#1769AA] hover:bg-[#EBF3FB] transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#1769AA] hover:bg-[#135488] transition shadow-sm"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#172B4D] hover:bg-[#F7F9FC]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-4 space-y-2 text-sm shadow-md">
          <Link
            href="/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-[#172B4D] hover:bg-[#F7F9FC] font-medium"
          >
            Course Catalog
          </Link>
          <Link
            href="/verify"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-[#172B4D] hover:bg-[#F7F9FC] font-medium"
          >
            Verify Certificate
          </Link>
          {user ? (
            <>
              <Link
                href={getDashboardLink()}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-[#1769AA] font-bold hover:bg-[#F7F9FC]"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-[#D64545] hover:bg-[#FDF2F2]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-lg border border-[#1769AA] text-[#1769AA] font-semibold"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-lg bg-[#1769AA] text-white font-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

