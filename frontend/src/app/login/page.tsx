"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
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
    <div className="flex-1 bg-[#F7F9FC] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Institutional Trust / Branding */}
        <div className="lg:col-span-5 space-y-6 hidden lg:block">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFF5F3] text-[#12355B] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-[#00A6A6]" />
              <span>National Single Sign-On</span>
            </div>
            <h1 className="text-3xl font-bold text-[#12355B] tracking-tight leading-tight">
              Institutional Access Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Secure authentication for Civil Servants, Accredited Subject Matter Trainers, and Administrative Governance Officers.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 text-xs text-[#172B4D]">
              <CheckCircle2 className="w-4 h-4 text-[#16875D] shrink-0 mt-0.5" />
              <span>Deterministic Competency Matching & Analytics</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-[#172B4D]">
              <CheckCircle2 className="w-4 h-4 text-[#16875D] shrink-0 mt-0.5" />
              <span>Timed Server-Side MCQ Assessments</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-[#172B4D]">
              <CheckCircle2 className="w-4 h-4 text-[#16875D] shrink-0 mt-0.5" />
              <span>Cryptographic Certificate Issuance & QR Verification</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Authentication Card */}
        <div className="lg:col-span-7 space-y-5">
          {/* Demo Fast-Login Pills for Judges */}
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#12355B]">
                <Sparkles className="w-3.5 h-3.5 text-[#D89B18]" />
                <span>Evaluator 1-Click Fast Login:</span>
              </div>
              <span className="text-[10px] text-[#00A6A6] font-semibold">Instant Access</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickLogin("admin")}
                className="p-2.5 rounded-lg bg-[#FEF8E7] hover:bg-[#FDF0D0] border border-[#D89B18]/30 text-[#12355B] flex flex-col items-center gap-1 transition text-center"
              >
                <Shield className="w-4 h-4 text-[#D89B18]" />
                <span className="text-[11px] font-bold">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => quickLogin("trainer")}
                className="p-2.5 rounded-lg bg-[#EBF3FB] hover:bg-[#D4E6F7] border border-[#1769AA]/30 text-[#12355B] flex flex-col items-center gap-1 transition text-center"
              >
                <GraduationCap className="w-4 h-4 text-[#1769AA]" />
                <span className="text-[11px] font-bold">Trainer</span>
              </button>
              <button
                type="button"
                onClick={() => quickLogin("trainee")}
                className="p-2.5 rounded-lg bg-[#DFF5F3] hover:bg-[#C2EDE9] border border-[#00A6A6]/30 text-[#12355B] flex flex-col items-center gap-1 transition text-center"
              >
                <BookOpen className="w-4 h-4 text-[#00A6A6]" />
                <span className="text-[11px] font-bold">Trainee</span>
              </button>
            </div>
          </div>

          {/* Manual Credentials Form */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-sm space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#12355B]">Sign In to Portal</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Enter your institutional credentials</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-[#FDF2F2] border border-[#D64545]/30 text-[#D64545] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] uppercase tracking-wider mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@capacity-connect.example"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] text-[#172B4D] placeholder-[#64748B] focus:outline-none focus:border-[#1769AA]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-[#172B4D] uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-[#64748B]">Min 8 characters</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] text-[#172B4D] placeholder-[#64748B] focus:outline-none focus:border-[#1769AA]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-[#1769AA] hover:bg-[#135488] disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2"
              >
                {isLoading ? "Authenticating..." : "Sign In to Portal"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-[#E2E8F0] text-xs text-[#64748B]">
              Don&apos;t have an accredited account?{" "}
              <Link href="/register" className="font-semibold text-[#1769AA] hover:underline">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

