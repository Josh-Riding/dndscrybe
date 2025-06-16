"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AgeConsent({ onConfirm }: { onConfirm: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleConsent = () => {
    if (checked) {
      setConfirmed(true);
      onConfirm();
    }
  };

  return (
    <div className="rounded-xl border border-red-600 bg-[#1e1e1e] p-6 text-[#f5f5f5] shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-[#df2935]">
        Age Confirmation Required
      </h2>
      <p className="mb-4 leading-relaxed text-[#cccccc]">
        By using this service, you confirm that you are at least{" "}
        <strong>13 years old</strong> and agree to our{" "}
        <Link
          href="/terms"
          className="text-[#df2935] underline hover:text-[#b2222b]"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-[#df2935] underline hover:text-[#b2222b]"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <div className="mb-4 flex items-center space-x-2">
        <input
          type="checkbox"
          id="agree"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="h-4 w-4 accent-[#df2935]"
        />
        <label htmlFor="agree" className="text-sm text-[#cccccc]">
          I am 13 or older and I agree to the Terms of Service and Privacy
          Policy.
        </label>
      </div>

      <Button
        onClick={handleConsent}
        disabled={!checked}
        className="bg-[#df2935] text-white hover:bg-[#b2222b] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Confirm and Continue
      </Button>

      {!confirmed && (
        <p className="mt-4 text-sm text-red-400">
          You must confirm your age and agreement to continue.
        </p>
      )}
    </div>
  );
}
