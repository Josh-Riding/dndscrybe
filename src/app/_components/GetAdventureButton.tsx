"use client";

import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import Button from "./Button";

export default function GetAdventureButton({
  session,
}: {
  session: Session | null;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (session) {
      router.push("/upload");
    } else {
      router.push("/auth/signin"); // Or your custom signin route
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="rounded-2xl bg-[#df2935] px-6 py-3 text-lg text-white shadow-lg hover:bg-[#b2222b]"
    >
      Get Your Adventure Transcribed Now
    </Button>
  );
}
