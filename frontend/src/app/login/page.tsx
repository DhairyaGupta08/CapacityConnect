"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user.status === "pending") {
        router.push("/pending-approval");
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "trainer") {
        router.push("/trainer/dashboard");
      } else {
        router.push("/trainee/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gov-slate-100">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-gov-navy flex items-center justify-center mx-auto text-white shadow-md border border-emerald-400/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
            Sign In to Capacity Connect
          </h1>
          <p className="text-xs text-gov-slate-600">
            Official Single Sign-On for Civil Servants, Trainers, and Governance Administrators.
          </p>
        </div>

        {/* Demo Fast-Login Pills for Judges */}
        <div className="bg-white p-4 rounded-xl border border-gov-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gov-navy">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Fast Demo Persona Switcher (1-Click)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickLogin("admin")}
              className="p-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 flex flex-col items-center gap-1 transition text-center"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span className="text-[11px] font-bold">Admin</span>
            </button>
            <button
              type="button"
              onClick={() => quickLogin("trainer")}
              className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 flex flex-col items-center gap-1 transition text-center"
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold">Trainer</span>
            </button>
            <button
              type="button"
              onClick={() => quickLogin("trainee")}
              className="p-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 flex flex-col items-center gap-1 transition text-center"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-bold">Trainee</span>
            </button>
          </div>
        </div>

        {/* Manual Credentials Form */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-gov-slate-200 shadow-sm space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gov-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@capacity-connect.example"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-gov-slate-400">Min 8 characters</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gov-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              {isLoading ? "Authenticating..." : "Sign In to Portal"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gov-slate-100 text-xs text-gov-slate-500">
            Don&apos;t have an accredited account?{" "}
            <Link href="/register" className="font-bold text-emerald-600 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
