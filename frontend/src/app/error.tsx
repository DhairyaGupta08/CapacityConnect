"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isChunkError =
    error?.name === "ChunkLoadError" ||
    error?.message?.includes("Loading chunk") ||
    error?.message?.includes("ChunkLoadError");

  useEffect(() => {
    console.error("Application error:", error);
    // If a chunk failed to load due to dev server re-bundle, auto reload once
    if (isChunkError && typeof window !== "undefined") {
      const reloaded = sessionStorage.getItem("chunk_reload_attempted");
      if (!reloaded) {
        sessionStorage.setItem("chunk_reload_attempted", "true");
        window.location.reload();
      }
    }
  }, [error, isChunkError]);

  const handleRetry = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("chunk_reload_attempted");
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <main
      id="main-content"
      className="flex-1 flex items-center justify-center p-6 bg-[#F7F9FC]"
    >
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(18,53,91,0.06)] border border-[#D64545]/20 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FDF2F2] text-[#D64545] border border-[#D64545]/30 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#12355B]">
            {isChunkError ? "Updated Application Build" : "An Error Occurred"}
          </h1>
          <p className="text-[#64748B] text-xs sm:text-sm mt-1">
            {isChunkError
              ? "New application assets were built. Please refresh to load the latest version."
              : "An issue occurred while processing your request. Please try again or return to the portal."}
          </p>
        </div>
        <div className="pt-2">
          <Button
            onClick={handleRetry}
            variant="primary"
            leftIcon={isChunkError ? <RefreshCw className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
          >
            {isChunkError ? "Refresh Page" : "Try Again"}
          </Button>
        </div>
      </div>
    </main>
  );
}
