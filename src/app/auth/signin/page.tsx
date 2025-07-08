"use client";

import { Suspense } from "react";
import { SignInWithConsent } from "@/app/_components/SignInWithConsent";

export default function SignInPage() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center text-[#f5f5f5]"
      style={{
        backgroundImage: "url('/photo-wall-texture-pattern.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <h1 className="font-serif text-5xl font-bold drop-shadow-md md:text-6xl">
          Welcome Back to Your Adventure
        </h1>
        <p className="mt-4 max-w-lg text-lg text-[#cccccc]">
          Sign in to continue your journey. Your stories, your notes, your world
          — all remembered.
        </p>

        <div className="mt-10 w-full max-w-sm rounded-xl border border-[#3a3a3a] bg-[#1e1e1e] p-6 shadow-lg">
          <Suspense fallback={<p>Loading sign in...</p>}>
            <SignInWithConsent />
          </Suspense>
          <p className="mt-4 text-xs text-gray-400">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-[#df2935] hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[#df2935] hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
