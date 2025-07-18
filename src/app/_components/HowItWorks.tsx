"use client";

import { useState } from "react";

export default function HowItWorks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className="mx-auto max-w-6xl bg-[#1e1e1e] px-6 py-20">
      <h2 className="mb-6 text-center text-4xl font-bold text-[#f5f5f5]">
        How It Works
      </h2>

      <div className="mb-12 flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group inline-flex items-center gap-3 rounded-full border-2 border-[#77b3d1] px-6 py-3 text-[#77b3d1] transition duration-300 hover:bg-[#77b3d1] hover:text-[#1e1e1e]"
        >
          <span className="text-lg font-semibold tracking-wide">
            Watch Demo
          </span>
          <svg
            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 3l1.41 1.41L6.83 9H17v2H6.83l4.58 4.59L10 17l-7-7 7-7z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center gap-12">
        <div className="w-full max-w-2xl space-y-10">
          {[
            {
              title: "Upload a Recording",
              description: "Import your recording to kick things off.",
            },
            {
              title: "Powerful AI Transcribes In Seconds",
              description:
                "AI transcribes and then summarizes your campaign in a style you choose.",
            },
            {
              title: "Chat with Your Notes",
              description:
                "Engage with your session transcripts, ask questions, and explore details like never before.",
            },
            {
              title: "Read & Remember",
              description:
                "Review, download, and share perfect notes to keep your adventure on track.",
            },
          ].map(({ title, description }, i) => (
            <div
              key={title}
              className="border-l-4 border-[#77b3d1] pl-6 text-lg"
            >
              <h3 className="mb-2 text-2xl font-semibold text-[#f5f5f5]">
                {`Step ${i + 1}: ${title}`}
              </h3>
              <p className="text-[#cccccc]">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-8 right-8 text-3xl text-white hover:text-[#df2935]"
          >
            &times;
          </button>
          <video
            src="/videos/dndscrybe_demo.mp4"
            controls
            autoPlay
            className="w-full max-w-4xl rounded-lg shadow-lg"
          />
        </div>
      )}
    </section>
  );
}
