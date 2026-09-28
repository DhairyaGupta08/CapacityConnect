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
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gov-slate-100">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-gov-navy flex items-center justify-center mx-auto text-white shadow-md border border-emerald-400/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-gov-navy tracking-tight">
            Accreditation & Registration
          </h1>
          <p className="text-xs text-gov-slate-600">
            Join the National Capacity Building Network as a Trainee Officer or Certified Instructor.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-gov-slate-200 shadow-sm space-y-5">
          {/* Role Toggle Selector */}
          <div>
            <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-2">
              Select Registration Track
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("trainee")}
                className={`p-3 rounded-lg border text-left flex items-center gap-3 transition ${
                  role === "trainee"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20"
                    : "border-gov-slate-200 hover:bg-gov-slate-50 text-gov-slate-700"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  role === "trainee" ? "bg-emerald-600 text-white" : "bg-gov-slate-100 text-gov-slate-600"
                }`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Civil Servant / Trainee</div>
                  <div className="text-[10px] text-gov-slate-500">Immediate access to LMS</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("trainer")}
                className={`p-3 rounded-lg border text-left flex items-center gap-3 transition ${
                  role === "trainer"
                    ? "border-blue-600 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-500/20"
                    : "border-gov-slate-200 hover:bg-gov-slate-50 text-gov-slate-700"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  role === "trainer" ? "bg-blue-600 text-white" : "bg-gov-slate-100 text-gov-slate-600"
                }`}>
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Subject Expert / Trainer</div>
                  <div className="text-[10px] text-gov-slate-500">Requires Admin Approval</div>
                </div>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gov-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Rajesh Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
                  Official Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gov-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@department.gov.in"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gov-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
                  Ministry / Organization
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gov-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Ministry of Electronics & IT"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Role-Specific Inputs */}
            {role === "trainee" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-gov-slate-50 border border-gov-slate-200">
                <div>
                  <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                    Department / Wing
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Network Security Division"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Deputy Director / Scientist"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gov-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider mb-1">
                    Expertise Subjects (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="Cybersecurity, CERT-In Guidelines, DPI, India Stack"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-blue-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider mb-1">
                    Years of Relevant Experience: {experienceYears} Years
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              {isLoading ? "Creating Account..." : "Complete Registration"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gov-slate-100 text-xs text-gov-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-emerald-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
