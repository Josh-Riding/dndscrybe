"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckIcon, MinusIcon } from "lucide-react";
import React from "react";

const packs = {
  small: "adventure-pack",
  medium: "guild-pack",
  large: "dragons-hoard",
};

export default function PricingSectionCards() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/upload");
  };
  return (
    <>
      {/* Pricing */}
      <div className="container mx-auto px-4 py-24 md:px-6 lg:py-32 2xl:max-w-[1400px]">
        {/* Title */}
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Pricing
          </h2>
          <p className="text-muted-foreground mt-1">
            Each credit equals one minute of transcription. <br />
            Use them whenever you like—credits never expire.
          </p>
        </div>
        {/* End Title */}
        {/* Switch */}

        {/* End Switch */}
        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
          {/* Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="mb-7">Free</CardTitle>
              <span className="text-5xl font-bold">Free</span>
            </CardHeader>
            <CardDescription className="text-center">
              Try Out All Features
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Start with 120 minutes of transcription (120 credits)
                  </span>
                </li>

                <li className="flex space-x-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Get a detailed summary with every session
                  </span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Ask questions and chat with your past sessions
                  </span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {" "}
                    Your transcriptions are stored forever
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={"outline"}
                onClick={handleClick}
              >
                Let's go!
              </Button>
            </CardFooter>
          </Card>
          {/* End Card */}
          {/* Card */}
          <Card className="border-primary flex flex-col">
            <CardHeader className="pb-2 text-center">
              <Badge className="mb-3 w-max self-center uppercase">
                Most popular
              </Badge>
              <CardTitle className="!mb-7">Adventure Pack</CardTitle>
              <span className="text-5xl font-bold">$5</span>
            </CardHeader>
            <CardDescription className="mx-auto w-11/12 text-center">
              Perfect for transcribing your one-shot quest.
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    100 Transcription Credits
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => router.push(`/purchase-credits/${packs.small}`)}
              >
                Buy Credits
              </Button>
            </CardFooter>
          </Card>
          {/* End Card */}
          {/* Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2 text-center">
              <Badge
                variant="outline"
                className="mb-3 w-max self-center uppercase"
              >
                20% Bulk Discount
              </Badge>
              <CardTitle className="mb-7">Guild Pack</CardTitle>
              <span className="text-5xl font-bold">$10</span>
            </CardHeader>
            <CardDescription className="mx-auto w-11/12 text-center">
              Built for heroes who gather every other week.
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    250 Transcription Credits
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={"outline"}
                onClick={() => router.push(`/purchase-credits/${packs.medium}`)}
              >
                Buy Credits
              </Button>
            </CardFooter>
          </Card>
          {/* End Card */}
          {/* Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2 text-center">
              <Badge
                variant="outline"
                className="mb-3 w-max self-center uppercase"
              >
                50% Bulk Discount
              </Badge>
              <CardTitle className="mb-7">Dragon's Hoard</CardTitle>
              <span className="text-5xl font-bold">$20</span>
            </CardHeader>
            <CardDescription className="mx-auto w-11/12 text-center">
              Made for weekly campaigns and epic chronicles.
            </CardDescription>
            <CardContent>
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    800 Transcription Credits
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={"outline"}
                onClick={() => router.push(`/purchase-credits/${packs.large}`)}
              >
                Buy Credits
              </Button>
            </CardFooter>
          </Card>
          {/* End Card */}
        </div>
        {/* End Grid */}
        {/* Comparison table */}
        {/* End Comparison table */}
      </div>
      {/* End Pricing */}
    </>
  );
}
