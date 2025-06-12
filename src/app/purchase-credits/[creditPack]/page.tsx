import Checkout from "@/app/_components/checkout";

type PageProps = {
  params: {
    creditPack: "guild-pack" | "adventure-pack" | "dragons-hoard";
  };
};

export default function Page({ params }: PageProps) {
  return (
    <div className="flex justify-center px-4 pt-10 pb-20">
      <div className="w-full max-w-2xl">
        <Checkout creditPackage={params.creditPack} />
      </div>
    </div>
  );
}
