"use client";

import * as React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { siteConfig } from "@/config/site";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [mounted, setMounted] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
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

  if (!mounted) {
    return (
      <nav className="z-50 flex items-center justify-between bg-black px-6 py-4 shadow-sm">
        <Link href="/">
          <span className="cursor-pointer font-serif text-2xl font-bold text-red-600 drop-shadow-md">
            {siteConfig.name}
          </span>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="z-50 flex items-center justify-between bg-black px-6 py-4 shadow-sm">
      <Link href="/">
        <span className="cursor-pointer font-serif text-2xl font-bold text-red-600 drop-shadow-md">
          {siteConfig.name}
        </span>
      </Link>

      <div className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList className="space-x-3">
            {session &&
              siteConfig.navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link
                    href={link.href}
                    className={navigationMenuTriggerStyle({
                      className:
                        "rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:bg-red-700 hover:text-red-100",
                    })}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              ))}

            <NavigationMenuItem>
              {session ? (
                <button
                  onClick={() => signOut()}
                  className={navigationMenuTriggerStyle({
                    className:
                      "rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:bg-red-700 hover:text-red-100",
                  })}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => router.push("/auth/signin")}
                  className={navigationMenuTriggerStyle({
                    className:
                      "rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-red-100 transition-colors hover:bg-red-800 hover:text-white",
                  })}
                >
                  Login
                </button>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-100 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? "" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-16 left-0 z-50 flex w-full flex-col items-center space-y-3 bg-black py-6 shadow-md md:hidden"
        >
          {session &&
            siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="w-4/5 rounded-md bg-gray-800 px-4 py-2 text-center text-sm font-medium text-gray-100 transition-colors hover:bg-gray-700"
              >
                {link.label}
              </Link>
            ))}

          {session ? (
            <button
              onClick={() => {
                void signOut();
                setIsOpen(false);
              }}
              className="w-4/5 rounded-md bg-gray-800 px-4 py-2 text-center text-sm font-medium text-gray-100 transition-colors hover:bg-gray-700"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                router.push("/auth/signin");
                setIsOpen(false);
              }}
              className="w-4/5 rounded-md bg-red-700 px-4 py-2 text-center text-sm font-medium text-red-100 transition-colors hover:bg-red-800"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
