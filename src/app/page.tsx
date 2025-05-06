import Button from "./_components/Button";
import { siteConfig } from "@/config/site";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
  }

  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col bg-[#1e1e1e] text-[#f5f5f5]">
        <section
          className="relative flex flex-col items-center justify-center bg-cover bg-center px-4 py-24 text-center"
          style={{ backgroundImage: "url('/photo-wall-texture-pattern.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10">
            <h1 className="font-serif text-5xl font-bold text-[#df2935] drop-shadow-md md:text-6xl">
              Your RPG Sessions. <br /> Transcribed. <br />
              Summarized. <br /> Remembered.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[#cccccc]">
              Upload your audio. Get back beautifully written session notes.
            </p>
            <div className="mt-10">
              <Link href="/upload">
                <Button className="rounded-2xl bg-[#df2935] px-6 py-3 text-lg text-white shadow-lg hover:bg-[#b2222b]">
                  Begin the Lorekeeper’s Log
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#2a2a2a] py-16 text-center">
          <h2 className="text-4xl font-bold text-[#f5f5f5]">Arcane Features</h2>
          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Auto Transcription",
                description:
                  "Convert spoken words into accurate text, instantly.",
              },
              {
                title: "Summarized Logs",
                description: "Get concise campaign notes after every session.",
              },
              {
                title: "Private & Secure",
                description: "Your sessions stay yours—encrypted and safe.",
              },
              {
                title: "Built for RPG",
                description: "Crafted with adventurers, for adventurers.",
              },
            ].map(({ title, description }) => (
              <div
                key={title}
                className="relative overflow-hidden rounded-xl bg-[#1e1e1e] p-6 text-left shadow-md transition-shadow hover:shadow-lg hover:shadow-[#df293580]"
              >
                <h3 className="mb-2 text-xl font-bold text-[#f5f5f5]">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[#cccccc]">
                  {description}
                </p>
                <span className="animate-flicker pointer-events-none absolute top-0 left-0 h-full w-full bg-gradient-to-r from-[#f5deb3]/10 via-[#f5deb3]/20 to-[#f5deb3]/10 blur-2xl"></span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl bg-[#1e1e1e] px-6 py-20">
          <h2 className="text-center text-4xl font-bold text-[#df2935]">
            How It Works
          </h2>
          <div className="mt-12 space-y-10">
            {[
              {
                title: "Upload Recording",
                description: "Drop your session audio into the spell circle.",
              },
              {
                title: "Let the Magic Happen",
                description: "AI transcribes and summarizes your campaign.",
              },
              {
                title: "Read & Remember",
                description:
                  "Review and download elegant notes to keep your adventure on track.",
              },
            ].map(({ title, description }, i) => (
              <div
                key={title}
                className="border-l-4 border-[#df2935] pl-6 text-lg"
              >
                <h3 className="mb-2 text-2xl font-semibold text-[#f5f5f5]">
                  {`Step ${i + 1}: ${title}`}
                </h3>
                <p className="text-[#cccccc]">{description}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="my-16 flex items-center justify-center">
          <div className="h-px w-3/4 bg-gradient-to-r from-[#df2935] via-[#f5f5f5]/20 to-[#df2935]" />
        </div>

        <section className="bg-[#1e1e1e] px-6 py-20 text-center">
          <h2 className="text-4xl font-bold text-[#df2935]">
            Why {siteConfig.name}?
          </h2>
          <div className="mx-auto mt-6 max-w-3xl space-y-6 text-lg leading-relaxed text-[#cccccc]">
            <p>Because stories matter. Because memory is fragile.</p>
            <p>
              How many times have you sat with friends, laughing, trying to
              piece together that incredible moment — when you fought... was it
              a God? No, maybe a Demon? No, that was from the older session. The
              details blur, the timelines tangle, and slowly, the legends slip
              away.
            </p>
            <p>
              And then there’s the classic: the GM flips through a blank
              notebook, squinting, “Did I give you that magic sword last
              session... or was that someone else?” A map half-sketched. A
              villain’s name forgotten. The thread of the tale begins to fray.
            </p>
            <p>
              {siteConfig.name} exists so your adventures are never lost to
              time. Every battle, every twist of fate, every heroic stand —
              remembered as it was, not as it was almost recalled. Here, for
              GM's and players alike, your legends live forever.
            </p>
          </div>
        </section>

        <section className="bg-[#2a2a2a] py-20 text-center">
          <h2 className="text-3xl font-bold text-[#f5f5f5]">
            Remember Every Chapter of Your Campaign
          </h2>
          <p className="mt-4 text-[#cccccc]">
            Sign up now and make every session unforgettable.
          </p>
          <Link href="/upload">
            {" "}
            <Button className="mt-8 rounded-2xl bg-[#df2935] px-6 py-3 text-lg text-white hover:bg-[#b2222b]">
              Upload Your First Session
            </Button>
          </Link>
        </section>
      </div>
    </HydrateClient>
  );
}
