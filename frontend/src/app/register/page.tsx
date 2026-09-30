"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Briefcase,
  Building,
  CheckCircle2,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  User,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<"trainee" | "trainer">("trainee");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [expertise, setExpertise] = useState("");
  const [experienceYears, setExperienceYears] = useState(3);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const payload: any = {
        full_name: fullName,
        email: email,
        password: password,
        role: role,
        organization: organization,
        experience_years: Number(experienceYears),
      };

      if (role === "trainee") {
        payload.department = department;
        payload.designation = designation;
      } else {
        payload.expertise_subjects = expertise
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const createdUser = await register(payload);
      if (createdUser.status === "pending") {
        router.push("/pending-approval");
      } else if (createdUser.role === "trainer") {
        router.push("/trainer/dashboard");
      } else {
        router.push("/trainee/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to register. Please verify inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F7F9FC] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Institutional Trust / Information */}
        <div className="lg:col-span-4 space-y-6 hidden lg:block sticky top-24">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFF5F3] text-[#12355B] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-[#00A6A6]" />
              <span>National Capacity Network</span>
            </div>
            <h1 className="text-2xl font-bold text-[#12355B] tracking-tight leading-tight">
              Officer & Trainer Accreditation
            </h1>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Register to participate in verified public sector learning or apply as a recognized subject matter instructor.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="text-xs font-bold text-[#12355B] uppercase tracking-wider">
              Track Guidelines:
            </div>
            <div className="space-y-2 text-xs text-[#64748B]">
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#1769AA]">•</span>
                <span><b>Civil Servants:</b> Immediate activation for courses & timed certification assessments.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#1769AA]">•</span>
                <span><b>Trainers:</b> Requires administrative governance review & expertise validation.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Registration Card */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#12355B]">Create Accredited Account</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Select your role track to configure credentials</p>
          </div>

          {/* Role Toggle Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#172B4D] uppercase tracking-wider mb-2">
              Select Registration Track
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("trainee")}
                className={`p-3 rounded-lg border text-left flex items-center gap-3 transition ${
                  role === "trainee"
                    ? "border-[#1769AA] bg-[#EBF3FB] text-[#12355B] font-bold ring-2 ring-[#1769AA]/20"
                    : "border-[#E2E8F0] hover:bg-[#F7F9FC] text-[#64748B]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    role === "trainee" ? "bg-[#1769AA] text-white" : "bg-[#F7F9FC] text-[#64748B]"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Civil Servant / Trainee</div>
                  <div className="text-[10px] text-[#64748B]">Immediate access to LMS</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("trainer")}
                className={`p-3 rounded-lg border text-left flex items-center gap-3 transition ${
                  role === "trainer"
                    ? "border-[#00A6A6] bg-[#DFF5F3] text-[#12355B] font-bold ring-2 ring-[#00A6A6]/20"
                    : "border-[#E2E8F0] hover:bg-[#F7F9FC] text-[#64748B]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    role === "trainer" ? "bg-[#00A6A6] text-white" : "bg-[#F7F9FC] text-[#64748B]"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Subject Expert / Trainer</div>
                  <div className="text-[10px] text-[#64748B]">Requires Admin Approval</div>
                </div>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#FDF2F2] border border-[#D64545]/30 text-[#D64545] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Rajesh Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] text-[#172B4D] placeholder-[#64748B] focus:outline-none focus:border-[#1769AA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] uppercase tracking-wider mb-1.5">
                  Official Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@department.gov.in"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] text-[#172B4D] placeholder-[#64748B] focus:outline-none focus:border-[#1769AA]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] text-[#172B4D] placeholder-[#64748B] focus:outline-none focus:border-[#1769AA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] uppercase tracking-wider mb-1.5">
                  Ministry / Organization
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Ministry of Electronics & IT"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] text-[#172B4D] placeholder-[#64748B] focus:outline-none focus:border-[#1769AA]"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Role-Specific Inputs */}
            {role === "trainee" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0]">
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] uppercase tracking-wider mb-1">
                    Department / Wing
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Network Security Division"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] text-[#172B4D] placeholder-[#64748B] focus:outline-none focus:border-[#1769AA] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] uppercase tracking-wider mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Deputy Director / Scientist"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] text-[#172B4D] placeholder-[#64748B] focus:outline-none focus:border-[#1769AA] bg-white"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                    Expertise Subjects (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="Cybersecurity, CERT-In Guidelines, DPI, India Stack"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] text-[#172B4D] placeholder-[#64748B] focus:outline-none focus:border-[#1769AA] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#12355B] uppercase tracking-wider mb-1">
                    Years of Relevant Experience: {experienceYears} Years
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full accent-[#1769AA]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#1769AA] hover:bg-[#135488] disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2"
            >
              {isLoading ? "Creating Account..." : "Complete Registration"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#E2E8F0] text-xs text-[#64748B]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#1769AA] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

