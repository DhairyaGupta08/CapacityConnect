"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  Award,
  Bell,
  BookOpen,
  CheckSquare,
  FileCheck,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Layers,
  LogOut,
  PlusCircle,
  Settings,
  Shield,
  ShieldAlert,
  UserCheck,
  Users,
} from "lucide-react";

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const role = user.role;

  const adminNav = [
    { label: "Overview & KPIs", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Trainer Approvals", href: "/admin/approvals", icon: UserCheck },
    { label: "Competency Matching", href: "/admin/competency", icon: Layers },
    { label: "User Directory", href: "/admin/users", icon: Users },
    { label: "Broadcasts", href: "/admin/announcements", icon: Bell },
  ];

  const trainerNav = [
    { label: "Trainer Dashboard", href: "/trainer/dashboard", icon: LayoutDashboard },
    { label: "My Authored Courses", href: "/trainer/courses", icon: BookOpen },
    { label: "Create New Course", href: "/trainer/courses/new", icon: PlusCircle },
    { label: "Create Assessment", href: "/trainer/assessments/new", icon: CheckSquare },
    { label: "Trainee Performance", href: "/trainer/trainees", icon: Users },
    { label: "Trainer Profile", href: "/trainer/profile", icon: FileText },
  ];

  const traineeNav = [
    { label: "Learning Dashboard", href: "/trainee/dashboard", icon: LayoutDashboard },
    { label: "My Courses", href: "/trainee/courses", icon: BookOpen },
    { label: "Course Catalog", href: "/courses", icon: GraduationCap },
    { label: "My Certificates", href: "/trainee/certificates", icon: Award },
    { label: "Trainee Profile", href: "/trainee/profile", icon: FileText },
  ];

  const navItems = role === "admin" ? adminNav : role === "trainer" ? trainerNav : traineeNav;

  return (
    <aside className="w-64 bg-[#03045E] border-r border-[#0077B6]/30 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] text-[#CAF0F8]">
      {/* Role Banner */}
      <div className="p-4 border-b border-[#0077B6]/30 bg-[#023E8A]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0077B6] text-white font-bold flex items-center justify-center text-sm shadow border border-[#48CAE4]/40">
            {user.full_name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <div className="font-semibold text-sm text-white truncate">{user.full_name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block w-2 h-2 rounded-full ${
                user.status === "active" ? "bg-[#48CAE4]" : "bg-amber-400"
              }`}></span>
              <span className="text-[11px] text-[#ADE8F4] uppercase font-medium tracking-wider">
                {user.role} ({user.status})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 py-1 text-[11px] font-bold text-[#48CAE4] uppercase tracking-wider">
          {role === "admin" ? "Platform Governance" : role === "trainer" ? "Instruction & LMS" : "Capacity Learning"}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/courses" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-gradient-to-r from-[#0077B6] to-[#0096C7] text-white shadow-md border-l-4 border-[#48CAE4]"
                  : "text-[#ADE8F4] hover:bg-[#023E8A] hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#CAF0F8]" : "text-[#48CAE4]"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#0077B6]/30 mt-auto">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
