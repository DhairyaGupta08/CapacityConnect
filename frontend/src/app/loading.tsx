import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center p-12 bg-[#F7F9FC]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1769AA]" />
        <p className="text-sm font-semibold text-[#12355B]">Loading portal content...</p>
      </div>
    </div>
  );
}
