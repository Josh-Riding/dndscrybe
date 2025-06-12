import Checkout from "@/app/_components/checkout";

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
