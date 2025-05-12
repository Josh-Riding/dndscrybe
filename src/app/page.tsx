import Button from "./_components/Button";
import { siteConfig } from "@/config/site";
import { HydrateClient } from "@/trpc/server";
import Link from "next/link";
import Image from "next/image";
import { FAQSection } from "./_components/FAQ";
import HowItWorks from "./_components/HowItWorks";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col bg-[#1e1e1e] text-[#f5f5f5]">
        <section
          className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-fixed bg-center px-4 py-24 text-center"
          style={{ backgroundImage: "url('/photo-wall-texture-pattern.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10">
            <h1 className="font-serif text-5xl font-bold text-[#f5f5f5] drop-shadow-md md:text-6xl">
              Your RPG Sessions. <br /> Transcribed. <br />
              Summarized. <br /> Remembered.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[#cccccc]">
              Upload your session audio. <br />
              Get clear, organized notes. <br />
              Chat with your notes to uncover every detail.
            </p>

            <div className="mt-10">
              <Link href="/upload">
                <Button className="rounded-2xl bg-[#df2935] px-6 py-3 text-lg text-white shadow-lg hover:bg-[#b2222b]">
                  Get Your Adventure Transcribed Now
                </Button>
              </Link>
              <p className="mt-2 text-xs font-semibold tracking-wide text-white/70">
                Start for Free
              </p>
              <br />
              <div className="mt-8 flex flex-col items-center">
                <div className="flex -space-x-4">
                  {[
                    "/avatars/image2.jpg",
                    "/avatars/image1.jpg",
                    "/avatars/image3.jpg",
                    "/avatars/image4.jpg",
                    "/avatars/image6.jpg",
                  ].map((src, idx) => (
                    <Image
                      key={idx}
                      src={src}
                      alt="User avatar"
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full border-2 border-white/20 object-cover"
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm text-[#cccccc]">
                  Loved by players, praised by GMs, <br />
                  and never rolls a disadvantage.
                </p>
              </div>
            </div>
          </div>
        </section>
        <HowItWorks />
        <section className="bg-[#2a2a2a] py-16 text-center">
          <h2 className="font-serif text-5xl tracking-tight text-[#f5f5f5]">
            Arcane Features
            <span className="mx-auto mt-4 block h-[2px] w-12 bg-[#77b3d1]" />
          </h2>

          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Clear the Noise",
                description:
                  "Got background music or loud static? No problem. Our AI cleans up messy audio so it can hear what matters most.",
              },
              {
                title: "Ask Your Notes",
                description:
                  "Forgot who had the magic item last game? Just ask! Talk to your transcript like a smart helper, great for players and game masters.",
              },
              {
                title: "Edit Anytime",
                description:
                  "Want to add or fix something? You can update your notes online and save them forever. You and the AI make a great team.",
              },
              {
                title: "Super Accurate",
                description:
                  "Our AI gets 95 out of 100 words right, way better than others. That means your notes will be clear, sharp, and ready to use.",
              },
            ].map(({ title, description }) => (
              <div
                key={title}
                className="flex h-full flex-col justify-between rounded-lg border border-[#3a3a3a] bg-[#1c1c1c] p-6 text-left transition-colors hover:border-[#77b3d1]"
              >
                <h3 className="mb-3 text-lg font-semibold tracking-wide text-[#f5f5f5]">
                  {title}
                </h3>
                <p className="flex-grow text-sm leading-relaxed text-[#bbbbbb]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="my-16 flex items-center justify-center">
          <div className="h-px w-3/4 bg-gradient-to-r from-[#77b3d1] via-[#f5f5f5]/20 to-[#77b3d1]" />
        </div>
        <section className="bg-[#1e1e1e] px-6 py-20 text-center">
          <h2 className="text-4xl font-bold text-[#f5f5f5]">
            Trusted by Adventurers Everywhere
          </h2>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  "I finally remembered what I said three sessions ago. Game-changing.",
                name: "Bob, Game Master/Player",
                image: "/avatars/image1.jpg",
              },
              {
                quote:
                  "I really don't like writing down details during a session in the middle of the action. This lets me focus on the game and have more fun!",
                name: "Josh, Game Master/Player",
                image: "/avatars/image2.jpg",
              },

              {
                quote:
                  "I use it after every game night. It's like having a scrybe 😉 with perfect memory.",
                name: "Lauren, Player",
                image: "/avatars/image3.jpg",
              },
              {
                quote:
                  "The AI summaries are so good I print them out and bring them to the next session.",
                name: "Myla, Player",
                image: "/avatars/image4.jpg",
              },
              {
                quote:
                  "I'm too lazy to write down everything, glad I found this.",
                name: "Ryan, Game Master/Player",
                image: "/avatars/image5.jpg",
              },
              {
                quote:
                  "Clean, fast, and spooky accurate. I keep the chat feature open while we play.",
                name: "Keith, Game Master",
                image: "/avatars/image6.jpg",
              },
            ].map(({ quote, name, image }) => (
              <div
                key={name}
                className="flex flex-col items-center rounded-xl bg-[#2a2a2a] p-6 shadow-md hover:shadow-lg hover:shadow-[#df293580]"
              >
                <Image
                  src={image || "/avatars/dnd.jpg"}
                  alt={name}
                  width={64}
                  height={64}
                  className="mb-4 h-16 w-16 rounded-full object-cover"
                />
                <p className="mb-4 text-center text-sm text-[#cccccc] italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <p className="text-center text-sm font-semibold text-[#f5f5f5]">
                  — {name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#1e1e1e] px-6 py-20 text-center">
          <h2 className="text-4xl font-bold text-[#f5f5f5]">
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
              GM&#39;s and players alike, your legends live forever.
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
        <FAQSection />
      </div>
    </HydrateClient>
  );
}
