"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { AgeConsent } from "./AgeConsent";
import { Button } from "@/components/ui/button";

export function SignInWithConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ageConsentConfirmed");
    setHasConsent(stored === "true");
  }, []);

  const handleConsentConfirmed = () => {
    localStorage.setItem("ageConsentConfirmed", "true");
    setHasConsent(true);
    setShowConsent(false);
    void signIn("discord");
  };

  if (showConsent && !hasConsent) {
    return <AgeConsent onConfirm={handleConsentConfirmed} />;
  }

  return (
    <Button
      onClick={() => {
        if (hasConsent) {
          void signIn("discord");
        } else {
          setShowConsent(true);
        }
      }}
      className="w-full rounded-md bg-red-700 px-4 py-2 text-center text-sm font-medium text-red-100 transition-colors hover:bg-red-800"
    >
      Login
    </Button>
  );
}
