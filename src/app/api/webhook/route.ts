import { NextResponse } from "next/server";
import Stripe from "stripe";
import { addCredits } from "@/server/services/userService";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { processedStripeEvents } from "@/server/db/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature")!;
  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    console.log("Event id", event.id);
    console.log("✅ Event received:", event.type);
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const alreadyHandled = await db.query.processedStripeEvents.findFirst({
    where: eq(processedStripeEvents.id, event.id),
  });

  if (alreadyHandled) {
    console.log("⚠️ Duplicate event, skipping:", event.id);
    return NextResponse.json({ received: true, duplicate: true });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentIntentId = session.payment_intent;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Missing payment intent" },
        { status: 400 },
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId.toString(),
    );
    const meta = paymentIntent.metadata;

    if (!meta?.userId || !meta?.credits) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    await addCredits({
      userId: meta.userId,
      amount: parseInt(meta.credits, 10),
    });

    await db.insert(processedStripeEvents).values({
      id: event.id,
    });
  }

  return NextResponse.json({ received: true });
}
