"use client";

import { siteConfig } from "@/config/site";
import { useState } from "react";

const faqs = [
  {
    question: "How do I upload a session?",
    answer:
      "Sign In, Go to Uploads, upload your audio, and we'll handle the rest!",
  },
  {
    question: "What audio formats are supported?",
    answer:
      "We support most common formats like MP3, WAV, and M4A. If it plays, it probably works. (These are best MP3, MP4, MP2, AAC, WAV, FLAC, PCM, M4A, Ogg, Opus ,WebM)",
  },
  {
    question: "Can I edit my session summaries/transcriptions?",
    answer:
      "Absolutely. Once a session is processed, you can tweak, annotate, and even export your notes.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes — start for free, no credit card required.",
  },
  {
    question: "How accurate is it?",
    answer: `Very! ${siteConfig.name} gets about 95 out of every 100 words right. That’s incredible for a bot! It’s 47% more accurate than the next best option! That means less fixing and editing for you.

What makes it better? ${siteConfig.name} is really good at hearing through background noise, fast talking, and other stuff that usually messes up transcripts. In a typical session, there are thousands of words, so getting as close as possible is important for less cleanup.`,
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#1e1e1e] px-6 py-20 text-left">
      <h2 className="mb-12 text-center text-4xl font-bold text-[#f5f5f5]">
        Frequently Asked Questions
      </h2>
      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-lg border border-[#3a3a3a]">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-6 py-4 text-left text-lg font-semibold text-[#f5f5f5] hover:bg-[#2a2a2a]"
            >
              {faq.question}
              <span className="text-[#77b3d1]">
                {openIndex === i ? "−" : "+"}
              </span>
            </button>
            <div
              className={`px-6 pb-4 text-[#cccccc] transition-all duration-300 ease-in-out ${
                openIndex === i
                  ? "max-h-96 opacity-100"
                  : "max-h-0 overflow-hidden opacity-0"
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
