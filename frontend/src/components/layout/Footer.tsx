import React from "react";
import Link from "next/link";
import { Award, CheckCircle2, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#082B61] border-t border-[#1565C0] text-[#BBDEFB] text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Compliance */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0D47A1] flex items-center justify-center text-white border border-[#1565C0]">
                <Shield className="w-5 h-5 text-[#90CAF9]" />
              </div>
              <span className="font-bold text-base text-white">
                Capacity<span className="text-[#90CAF9]">Connect</span>
              </span>
            </div>
            <p className="text-xs text-[#90CAF9]/80 leading-relaxed">
              Standardized digital capacity building, role-based governance training, deterministic competency matching, and verified credential issuance.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#90CAF9] font-medium">
              <CheckCircle2 className="w-4 h-4" /> WCAG 2.1 AA Compliant & Secure
            </div>
          </div>

          {/* Col 2: Public Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-[#1565C0] pb-1">
              Public Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses" className="hover:text-white transition">
                  National Course Catalog
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-white transition flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#90CAF9]" />
                  Public Certificate Verification
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Departmental Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Register Civil Servant / Trainer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Pillars */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-[#1565C0] pb-1">
              Competency Pillars
            </h4>
            <ul className="space-y-2 text-xs text-[#BBDEFB]/80">
              <li>Cybersecurity in Governance</li>
              <li>Digital Public Infrastructure (DPI)</li>
              <li>Responsible AI & Data Protection</li>
              <li>Zero Trust Network Architecture</li>
              <li>Public Financial Management</li>
            </ul>
          </div>

          {/* Col 4: Technical & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-[#1565C0] pb-1">
              Architecture & Trust
            </h4>
            <ul className="space-y-2 text-xs text-[#BBDEFB]/80">
              <li>Modular Monolith Architecture</li>
              <li>ReportLab Cryptographic Cert PDFs</li>
              <li>Deterministic Explainable Matcher</li>
              <li>Argon2id & PyJWT Authentication</li>
              <li>Sovereign Cloud Deployment</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1565C0] mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#90CAF9]/60">
          <div>
            © {new Date().getFullYear()} Capacity Connect (SIH26075). National Digital Capacity Building Platform.
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <span>Server: FastAPI + PostgreSQL</span>
            <span>Client: Next.js + React 19</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
