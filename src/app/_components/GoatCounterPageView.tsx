"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function GoatCounterPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).goatcounter) {
      (window as any).goatcounter.count({
        path: pathname,
      });
    }
  }, [pathname]);

  return null;
}
