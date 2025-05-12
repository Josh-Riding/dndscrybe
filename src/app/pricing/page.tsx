"use client";
import React from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    title: "Basic",
    price: "$0.06 / minute",
    description:
      "Pay only for what you use, with additional chat tokens as needed",
    features: [
      "Full Audio Transcription",
      "Full Audio Summary",
      "Access and download all your transcriptions and summaries anytime",
      "100 chat tokens per hour transcribed",
    ],
    button: { label: "Use Now", action: "/dashboard" },
  },
  {
    title: "Unlimited",
    price: "$29 / month",
    description: "Unlimited transcription and chat tokens for consistent users",
    features: [
      "Unlimited audio transcriptions",
      "Unlimited audio summaries",
      "Access and download all your transcriptions and summaries anytime",
      "Unlimited chats",
    ],
    button: { label: "Subscribe", action: "/api/checkout/monthly" },
  },
];

export default function PricingPage() {
  const router = useRouter();

  const handleClick = async (path: string) => {
    if (path.startsWith("/api/checkout")) {
      const res = await fetch(path, { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } else {
      router.push(path);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#1e1e1e] px-4 py-20 text-[#f5f5f5]">
      <h1 className="text-center font-serif text-5xl font-bold text-[#df2935] drop-shadow-md">
        Simple, Transparent Pricing
      </h1>
      <p className="mt-4 text-center text-lg text-[#cccccc]">
        Only pay for what you need. Or get unlimited transcription with a flat
        monthly fee.
      </p>

      {/* Highlight the Free Hour offer */}
      <div className="mt-8 rounded-lg bg-[#f5deb3] p-2 text-center text-lg font-semibold text-[#df2935] shadow-lg">
        🎉 Your first hour is free! 🎉
        <p className="text-md mt-2 text-[#333333]">
          Experience our service at no cost for the first 60 minutes of
          transcription. No strings attached. Get started now!
        </p>
      </div>

      {/* Pricing Plan Grid */}
      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 justify-items-center gap-10 md:grid-cols-2 lg:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.title}
            className="relative w-full max-w-xs rounded-2xl border border-[#3a3a3a] bg-[#2a2a2a] p-8 text-center shadow-md transition-shadow hover:shadow-lg hover:shadow-[#df293580]"
          >
            <h2 className="text-2xl font-semibold text-[#f5f5f5]">
              {plan.title}
            </h2>
            <p className="mt-4 text-3xl font-bold text-[#df2935]">
              {plan.price}
            </p>
            <p className="mt-2 text-[#cccccc]">{plan.description}</p>
            <button
              onClick={() => handleClick(plan.button.action)}
              className="mt-8 w-full rounded-2xl bg-[#df2935] px-5 py-3 text-lg text-white shadow-lg transition-colors hover:bg-[#b2222b]"
            >
              {plan.button.label}
            </button>
            <ul className="mt-6 space-y-2 text-left text-sm text-[#cccccc]">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="before:mr-2 before:text-[#df2935] before:content-['•']"
                >
                  {f}
                </li>
              ))}
            </ul>

            <span className="pointer-events-none absolute top-0 left-0 h-full w-full bg-gradient-to-r from-[#f5deb3]/10 via-[#f5deb3]/20 to-[#f5deb3]/10 blur-2xl"></span>
          </div>
        ))}
      </div>
    </div>
  );
}
