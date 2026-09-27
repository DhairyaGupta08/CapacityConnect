import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex-1 flex items-center justify-center p-6 bg-gov-slate-50"
    >
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gov-slate-200 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gov-status-warning-bg text-gov-status-warning mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gov-navy mb-2">404 — Page Not Found</h1>
        <p className="text-gov-slate-600 text-sm mb-6">
          The requested page could not be located. It may have been moved, renamed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gov-navy rounded-md hover:bg-gov-navy-light transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Portal</span>
        </Link>
      </div>
    </main>
  );
}
