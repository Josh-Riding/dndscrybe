"use server";

import { headers } from "next/headers";

import { stripe } from "../lib/stripe";
import { auth } from "@/server/auth";

const creditPacks = {
  "adventure-pack": {
    price: "price_1RZIU7ABT5mgW2EOqfKV9DwI",
    credits: "100",
  },
  "guild-pack": {
    price: "price_1RZIUZABT5mgW2EOUnGMsNVS",
    credits: "250",
  },
  "dragons-hoard": {
    price: "price_1RZIUzABT5mgW2EOy7ZxkZXX",
    credits: "800",
  },
};

export async function fetchClientSecret(
  packChoice: "adventure-pack" | "guild-pack" | "dragons-hoard",
): Promise<string> {
  const origin = (await headers()).get("origin");

  const chosenPack = creditPacks[packChoice];

  if (!chosenPack) {
    throw new Error(`Invalid packChoice: ${packChoice}`);
  }

  const authSession = await auth();

  if (!authSession?.user?.id) {
    throw new Error("User session not found");
  }

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of
        // the product you want to sell
        price: chosenPack.price,
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: authSession.user.email ?? undefined,
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    payment_intent_data: {
      metadata: {
        userId: authSession.user.id,
        credits: chosenPack.credits,
      },
    },
  });
  if (!session.client_secret) {
    throw new Error("Failed to create Stripe session: client_secret is null");
  }

  return session.client_secret;
}
