import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#1e1e1e] px-6 py-20 text-[#f5f5f5]">
      <div className="mx-auto max-w-4xl space-y-10">
        <h1 className="text-center text-5xl font-bold text-[#df2935]">
          Privacy Policy
        </h1>
        <p className="text-center text-lg text-[#cccccc]">
          Last updated: April 30, 2025
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f5f5f5]">
            Your Stories Are Yours
          </h2>
          <p className="leading-relaxed text-[#cccccc]">
            We built this platform for storytellers — and storytellers deserve
            respect. When you upload your session audio, it’s your world, your
            creation. We’re just the scribes, helping you remember.
          </p>
          <p className="leading-relaxed text-[#cccccc]">
            Your recordings, transcriptions, summaries, and notes are private by
            default. We do not share, sell, or train any AI models on your
            content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f5f5f5]">What We Collect</h2>
          <ul className="list-disc space-y-2 pl-6 text-[#cccccc]">
            <li>Your uploaded audio files</li>
            <li>Your transcriptions and summaries</li>
            <li>Basic account information (email, username)</li>
            <li>Usage metadata (e.g., when you upload, what you click)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f5f5f5]">How We Use It</h2>
          <p className="leading-relaxed text-[#cccccc]">
            Your data helps us provide the service: transcribe sessions, store
            your notes, and make them accessible to you. We also use minimal
            metadata to improve stability and performance — things like knowing
            if uploads are failing or which features are most used.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f5f5f5]">Who Has Access</h2>
          <p className="leading-relaxed text-[#cccccc]">
            Only you — and anyone you share your session with — can access your
            transcriptions. Internally, only a limited number of authorized team
            members can view logs or error traces, and never your recordings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f5f5f5]">
            Data Deletion & Portability
          </h2>
          <p className="leading-relaxed text-[#cccccc]">
            You can delete any of your uploads or your account entirely at any
            time. When you do, we purge all related data from our servers.
          </p>
          <p className="leading-relaxed text-[#cccccc]">
            Want a copy of your transcripts or summaries before you go? Just let
            us know — we’ll send a downloadable archive.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f5f5f5]">
            Third Parties & Storage
          </h2>
          <p className="leading-relaxed text-[#cccccc]">
            We use secure cloud providers (like AWS) to store your files. All
            data is encrypted at rest and in transit. We don’t work with any
            third-party advertisers or trackers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f5f5f5]">
            Questions or Concerns?
          </h2>
          <p className="leading-relaxed text-[#cccccc]">
            You can always reach out at{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-[#df2935] underline hover:text-[#b2222b]"
            >
              {siteConfig.contactEmail}
            </a>
            . We’re here to help, and we take your trust seriously.
          </p>
        </section>

        <div className="pt-12 text-center">
          <Link
            href="/"
            className="text-lg text-[#df2935] underline hover:text-[#b2222b]"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
