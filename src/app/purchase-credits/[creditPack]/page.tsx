import Checkout from "@/app/_components/checkout";

interface PageProps {
  params: {
    creditPack: string; // Keep this as string, but validate in runtime below
  };
}

const validPacks = ["guild-pack", "adventure-pack", "dragons-hoard"] as const;

export default function Page({ params }: PageProps) {
  if (!validPacks.includes(params.creditPack as any)) {
    throw new Error("Invalid credit pack");
  }

  return (
    <div className="flex justify-center px-4 pt-10 pb-20">
      <div className="w-full max-w-2xl">
        <Checkout
          creditPackage={params.creditPack as (typeof validPacks)[number]}
        />
      </div>
    </div>
  );
}
