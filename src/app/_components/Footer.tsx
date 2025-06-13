import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-[#3a3a3a] bg-[#1e1e1e] py-8 text-center text-sm text-[#888]">
      <p>© 2025 {siteConfig.name}. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <Link href="/privacy" className="hover:text-[#df2935]">
          Privacy
        </Link>
        <Link href="/terms_of_service" className="hover:text-[#df2935]">
          Terms of Service
        </Link>
        <Link href="/purchase-credits" className="hover:text-[#df2935]">
          Pricing
        </Link>
        <a
          href="https://github.com/Josh-Riding/dndscrybe"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#df2935]"
        >
          GitHub
        </a>
        <Link href="/contact" className="hover:text-[#df2935]">
          Contact
        </Link>
      </div>
    </footer>
  );
}
