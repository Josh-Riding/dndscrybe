"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { AgeConsent } from "./AgeConsent";
import { Button } from "@/components/ui/button";
import { FaDiscord, FaGoogle } from "react-icons/fa";

export function SignInWithConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<
    "discord" | "google" | null
  >(null);

  useEffect(() => {
    const stored = localStorage.getItem("ageConsentConfirmed");
    if (stored === "true" && selectedProvider) {
      setHasConsent(true);
      void signIn(selectedProvider);
    }
  }, [selectedProvider]);

  const handleConsentConfirmed = () => {
    localStorage.setItem("ageConsentConfirmed", "true");
    setHasConsent(true);
    if (selectedProvider) {
      void signIn(selectedProvider);
    }
  };

  if (showConsent && !hasConsent) {
    return <AgeConsent onConfirm={handleConsentConfirmed} />;
  }

  if (hasConsent) {
    return (
      <div className="flex justify-center">
        <p className="text-gray-400">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={() => {
          if (hasConsent) {
            void signIn("discord");
          } else {
            setSelectedProvider("discord");
            setShowConsent(true);
          }
        }}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#5865F2] bg-[#5865F2] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[#4752c4]"
      >
        <FaDiscord className="h-5 w-5" />
        Continue with Discord
      </Button>

      <Button
        onClick={() => {
          if (hasConsent) {
            void signIn("google");
          } else {
            setSelectedProvider("google");
            setShowConsent(true);
          }
        }}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#DB4437] bg-[#DB4437] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[#b8352b]"
      >
        <FaGoogle className="h-5 w-5" />
        Continue with Google
      </Button>
    </div>
  );
}
