import { NextResponse } from "next/server";
import Stripe from "stripe";
import { addCredits } from "@/server/services/userService";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { processedStripeEvents } from "@/server/db/schema";
import { sendPurchaseEmail } from "@/app/utils/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    console.error("❌ Missing Stripe signature");
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("❌ Error verifying webhook signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Prevent duplicate processing
  const alreadyHandled = await db.query.processedStripeEvents.findFirst({
    where: eq(processedStripeEvents.id, event.id),
  });

  if (alreadyHandled) {
    console.warn(`⚠️ Duplicate event skipped: ${event.id}`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Handle checkout session completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentIntentId = session.payment_intent as string | null;
    let email = session.customer_email;
    const name = session.customer_details?.name ?? "Adventurer";

    try {
      // Fallback: fetch email from Stripe customer if not included
      if (!email && session.customer) {
        const customer = await stripe.customers.retrieve(
          session.customer as string,
        );

        // Check if it's a deleted customer
        if (!customer.deleted && typeof customer.email === "string") {
          email = customer.email;
        } else {
          console.error("❌ Stripe customer is deleted or missing email");
        }
      }

      if (!email) throw new Error("Missing customer email");

      if (!paymentIntentId) throw new Error("Missing payment intent ID");
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      const meta = paymentIntent.metadata;

      const userId = meta?.userId;
      const credits = parseInt(meta?.credits ?? "0", 10);

      if (!userId || isNaN(credits) || credits <= 0) {
        throw new Error("Invalid or missing metadata (userId or credits)");
      }

      // Send purchase confirmation email

      await sendPurchaseEmail(email, name, credits);

      // Add credits to user account

      await addCredits({ userId, amount: credits });

      // Mark event as processed
      await db.insert(processedStripeEvents).values({ id: event.id });
    } catch (err) {
      console.error("❌ Error processing purchase:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
