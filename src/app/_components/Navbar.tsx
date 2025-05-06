"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const authLink = session
    ? { label: "Logout", action: () => signOut() }
    : { label: "Login", action: () => signIn() };

  return (
    <nav className="z-50 flex items-center justify-between bg-[#1e1e1e] px-6 py-4 shadow-md">
      <Link href="/">
        <span className="cursor-pointer font-serif text-2xl font-bold text-[#df2935] drop-shadow-md">
          {siteConfig.name}
        </span>
      </Link>

      <div className="hidden space-x-6 text-sm font-medium text-[#f5f5f5] md:flex">
        {siteConfig.navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-[#df2935]"
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={authLink.action}
          className="transition-colors hover:text-[#df2935]"
        >
          {authLink.label}
        </button>
      </div>

      <div className="flex items-center md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#f5f5f5] focus:outline-none"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-16 left-0 z-50 flex w-full flex-col items-center space-y-4 bg-[#1e1e1e] py-6 shadow-md md:hidden"
        >
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg text-[#f5f5f5] transition-colors hover:text-[#df2935]"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              authLink.action();
              setIsOpen(false);
            }}
            className="text-lg text-[#f5f5f5] transition-colors hover:text-[#df2935]"
          >
            {authLink.label}
          </button>
        </div>
      )}
    </nav>
  );
}
