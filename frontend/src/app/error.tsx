"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex-1 flex items-center justify-center p-6 bg-gov-slate-50"
    >
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gov-status-error/30 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gov-status-error-bg text-gov-status-error mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gov-navy mb-2">Something went wrong</h1>
        <p className="text-gov-slate-600 text-sm mb-6">
          An error occurred while processing your request. Please retry or contact technical support.
        </p>
        <Button
          onClick={() => reset()}
          variant="primary"
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Try Again
        </Button>
      </div>
    </main>
  );
}
