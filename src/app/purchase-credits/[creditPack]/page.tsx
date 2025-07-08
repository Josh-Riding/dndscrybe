import Checkout from "@/app/_components/checkout";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

const validPacks = [
  "guild-pack",
  "adventure-pack",
  "dragons-hoard",
] as readonly string[];

interface PageProps {
  params: Promise<{
    creditPack: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { creditPack } = await params;
  const session = await auth();
  if (!session) {
    redirect(`/auth/signin?callbackUrl=/purchase-credits/${creditPack}`);
  }

  if (!validPacks.includes(creditPack)) {
    throw new Error("Invalid credit pack");
  }

  return (
    <div className="flex justify-center px-4 pt-10 pb-20">
      <div className="w-full max-w-2xl">
        <Checkout
          creditPackage={
            creditPack as "guild-pack" | "adventure-pack" | "dragons-hoard"
          }
        />
      </div>
    </div>
  );
}
