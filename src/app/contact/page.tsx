import { siteConfig } from "@/config/site";

export default function Contact() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#1e1e1e] px-6 py-20 text-center text-[#f5f5f5]">
      <h1 className="mb-6 font-serif text-4xl font-bold">Contact Us</h1>
      <p className="mb-4 max-w-md text-lg">
        Have questions or need support? Reach out anytime at:
      </p>
      <a
        href={`mailto:${siteConfig.contactEmail}`}
        className="text-xl font-semibold text-[#df2935] hover:text-[#b2222b]"
      >
        {siteConfig.contactEmail}
      </a>
    </section>
  );
}
