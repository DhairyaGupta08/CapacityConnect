"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/lib/authContext";

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "trainer" && user.role !== "admin") {
        router.push("/trainee/dashboard");
      } else if (user.status === "pending") {
        router.push("/pending-approval");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gov-slate-100">
        <div className="text-gov-navy font-bold text-sm">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-gov-slate-100 min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
