"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] text-[#f5f5f5]">
      {success ? (
        <p className="text-2xl font-semibold text-[#00ff88]">
          Upload Successful!
        </p>
      ) : (
        <p className="text-2xl font-semibold text-[#df2935]">
          Something went wrong.
        </p>
      )}
    </div>
  );
}
