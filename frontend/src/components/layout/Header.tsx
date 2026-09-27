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
    <header className="sticky top-0 z-40 w-full bg-[#023E8A] border-b border-[#0077B6]/50 text-white shadow-lg">
      {/* Top Sovereign Bar */}
      <div className="bg-[#03045E] border-b border-[#0077B6]/30 px-4 py-1.5 text-xs text-[#ADE8F4] flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#48CAE4] animate-pulse"></span>
          <span className="font-medium text-[#CAF0F8]">National Digital Capacity Building & Accreditation Platform</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <span className="text-[#ADE8F4]">CBC / DoPT Framework</span>
          <span className="text-[#0077B6]">|</span>
          <Link href="/verify" className="hover:text-white transition flex items-center gap-1.5 text-[#48CAE4] font-medium">
            <Award className="w-3.5 h-3.5" /> Public Certificate Verification
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0096C7] to-[#023E8A] flex items-center justify-center border border-[#48CAE4]/40 group-hover:scale-105 transition shadow-sm">
              <Shield className="w-5 h-5 text-[#CAF0F8]" />
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight flex items-center gap-1 text-white">
                Capacity<span className="text-[#48CAE4]">Connect</span>
              </div>
              <div className="text-[10px] text-[#ADE8F4] tracking-wider uppercase font-semibold">
                Digital Governance LMS
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4 text-sm font-medium">
            <Link
              href="/courses"
              className={`px-3.5 py-2 rounded-xl transition ${
                pathname.startsWith("/courses")
                  ? "bg-[#0077B6] text-white font-bold border border-[#48CAE4]/40 shadow-sm"
                  : "text-[#CAF0F8] hover:text-white hover:bg-[#0077B6]/50"
              }`}
            >
              Course Catalog
            </Link>
            <Link
              href="/verify"
              className={`px-3.5 py-2 rounded-xl transition ${
                pathname.startsWith("/verify")
                  ? "bg-[#0077B6] text-white font-bold border border-[#48CAE4]/40 shadow-sm"
                  : "text-[#CAF0F8] hover:text-white hover:bg-[#0077B6]/50"
              }`}
            >
              Verify Certificate
            </Link>
            {user && (
              <Link
                href={getDashboardLink()}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  pathname.includes("/dashboard")
                    ? "bg-[#0077B6] text-white font-bold border border-[#48CAE4]/40 shadow-sm"
                    : "text-[#CAF0F8] hover:text-white hover:bg-[#0077B6]/50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#48CAE4]" />
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#03045E]/80 border border-[#0096C7]/50 text-[#CAF0F8] text-xs font-semibold hover:bg-[#0077B6] hover:text-white transition shadow-sm"
              title="Quickly switch demo accounts for judges and evaluators"
            >
              <Users className="w-3.5 h-3.5 text-[#48CAE4]" />
              <span className="hidden sm:inline">Role Switcher:</span>
              <span className="capitalize text-white font-bold">{user ? user.role : "Guest"}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-[#ADE8F4]" />
            </button>

            {isDemoMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#03045E] border border-[#0096C7]/50 text-white shadow-2xl py-2 z-50 text-xs"
                onMouseLeave={() => setIsDemoMenuOpen(false)}
              >
                <div className="px-3.5 py-1 text-[11px] font-bold text-[#48CAE4] uppercase tracking-wider border-b border-[#0077B6]/40 pb-1.5 mb-1">
                  Demo Fast-Switch
                </div>
                <button
                  onClick={async () => {
                    setIsDemoMenuOpen(false);
                    await quickLogin("admin");
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-[#023E8A] flex items-center justify-between text-[#CAF0F8] hover:text-white transition"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#48CAE4]" />
                    <div>
                      <div className="font-semibold text-white">Admin (Governance)</div>
                      <div className="text-[10px] text-[#90E0EF]">Approvals, Competency & KPIs</div>
                    </div>
                  </div>
                  {user?.role === "admin" && <CheckCircle2 className="w-3.5 h-3.5 text-[#48CAE4]" />}
                </button>
                <button
                  onClick={async () => {
                    setIsDemoMenuOpen(false);
                    await quickLogin("trainer");
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-[#023E8A] flex items-center justify-between text-[#CAF0F8] hover:text-white transition"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#00B4D8]" />
                    <div>
                      <div className="font-semibold text-white">Trainer (Authoring)</div>
                      <div className="text-[10px] text-[#90E0EF]">Courses & MCQ Assessments</div>
                    </div>
                  </div>
                  {user?.role === "trainer" && <CheckCircle2 className="w-3.5 h-3.5 text-[#48CAE4]" />}
                </button>
                <button
                  onClick={async () => {
                    setIsDemoMenuOpen(false);
                    await quickLogin("trainee");
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-[#023E8A] flex items-center justify-between text-[#CAF0F8] hover:text-white transition"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#48CAE4]" />
                    <div>
                      <div className="font-semibold text-white">Trainee (Learner)</div>
                      <div className="text-[10px] text-[#90E0EF]">Take test & get certified</div>
                    </div>
                  </div>
                  {user?.role === "trainee" && <CheckCircle2 className="w-3.5 h-3.5 text-[#48CAE4]" />}
                </button>
              </div>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#0077B6]/60 transition text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-[#0096C7] text-white font-bold flex items-center justify-center border border-[#ADE8F4]/60 shadow-sm">
                  {user.full_name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="font-semibold text-xs text-white leading-tight">{user.full_name}</div>
                  <div className="text-[10px] text-[#ADE8F4] uppercase tracking-wider">{user.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#ADE8F4]" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#03045E] border border-[#0096C7]/50 text-white shadow-2xl py-1.5 z-50 text-xs"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-[#0077B6]/40">
                    <div className="font-semibold text-white truncate">{user.full_name}</div>
                    <div className="text-[11px] text-[#ADE8F4] truncate">{user.email}</div>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#023E8A] text-[#CAF0F8] hover:text-white transition"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#48CAE4]" />
                    Dashboard
                  </Link>
                  {user.role === "trainee" && (
                    <Link
                      href="/trainee/certificates"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#023E8A] text-[#CAF0F8] hover:text-white transition"
                    >
                      <Award className="w-4 h-4 text-[#48CAE4]" />
                      My Certificates
                    </Link>
                  )}
                  {user.role === "trainer" && (
                    <Link
                      href="/trainer/courses"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#023E8A] text-[#CAF0F8] hover:text-white transition"
                    >
                      <BookOpen className="w-4 h-4 text-[#00B4D8]" />
                      My Authored Courses
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      href="/admin/approvals"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#023E8A] text-[#CAF0F8] hover:text-white transition"
                    >
                      <Shield className="w-4 h-4 text-[#48CAE4]" />
                      Trainer Approvals
                    </Link>
                  )}
                  <div className="border-t border-[#0077B6]/40 my-1"></div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition"
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
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#03045E] hover:bg-[#0077B6] transition border border-[#0096C7]/50 shadow-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0077B6] hover:bg-[#0096C7] transition shadow-md"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#ADE8F4] hover:text-white hover:bg-[#0077B6]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#023E8A] border-b border-[#0077B6] px-4 pt-2 pb-4 space-y-2 text-sm">
          <Link
            href="/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-[#CAF0F8] hover:bg-[#0077B6]"
          >
            Course Catalog
          </Link>
          <Link
            href="/verify"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-[#CAF0F8] hover:bg-[#0077B6]"
          >
            Verify Certificate
          </Link>
          {user ? (
            <>
              <Link
                href={getDashboardLink()}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-[#48CAE4] font-bold hover:bg-[#0077B6]"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-rose-300 hover:bg-[#03045E]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-xl bg-[#03045E] text-white font-semibold"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-xl bg-[#0077B6] text-white font-bold"
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
