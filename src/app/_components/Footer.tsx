import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-[#3a3a3a] bg-[#1e1e1e] py-8 text-center text-sm text-[#888]">
      <p>© 2025 {siteConfig.name}. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="/privacy" className="hover:text-[#df2935]">
          Privacy
        </a>
        <a href="/terms_of_service" className="hover:text-[#df2935]">
          Terms of Service
        </a>
        <a href="#" className="hover:text-[#df2935]">
          GitHub
        </a>
        <a href="#" className="hover:text-[#df2935]">
          Contact
        </a>
      </div>
    </footer>
  );
}
