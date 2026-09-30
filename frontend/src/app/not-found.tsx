import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex-1 flex items-center justify-center p-6 bg-[#F7F9FC]"
    >
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(18,53,91,0.06)] border border-[#E2E8F0] text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FEF8E7] text-[#D89B18] border border-[#D89B18]/30 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#12355B]">404 — Page Not Found</h1>
          <p className="text-[#64748B] text-xs sm:text-sm mt-1">
            The requested page could not be located in the Capacity Connect registry. It may have been moved or is temporarily unavailable.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1769AA] rounded-lg hover:bg-[#12355B] transition shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to National Portal</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
