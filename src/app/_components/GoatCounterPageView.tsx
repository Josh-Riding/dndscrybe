"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    goatcounter?: {
      count: (options: { path: string }) => void;
    };
  }
}

export function GoatCounterPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.goatcounter?.count) {
      window.goatcounter.count({ path: pathname });
    }
  }, [pathname]);

  return null;
}
