import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia"
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // Create the payment record
      await prisma.payment.create({
        data: {
          userId: session.metadata!.userId,
          stripePaymentId: session.payment_intent as string,
          amount: session.amount_total!,
          status: "completed"
        }
      });

      // Create the article
      await prisma.article.create({
        data: {
          title: session.metadata!.title,
          description: session.metadata!.description,
          imageUrl: session.metadata!.imageUrl || null,
          authorId: session.metadata!.userId,
          isUserCreated: true
        }
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      return NextResponse.json(
        { error: "Failed to process payment" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}