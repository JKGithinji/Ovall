import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handleSuccessfulPayment(paymentIntent)
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handleFailedPayment(failedPayment)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { userId, title, description, imageUrl } = paymentIntent.metadata

    // Update payment status
    await prisma.payment.update({
      where: { stripeSessionId: paymentIntent.id },
      data: { status: "completed" },
    })

    // Create the custom card
    await prisma.customCard.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        createdBy: userId,
        isPaid: true,
        isActive: true,
      },
    })

    console.log(`Custom card created for payment ${paymentIntent.id}`)
  } catch (error) {
    console.error("Error handling successful payment:", error)
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update payment status
    await prisma.payment.update({
      where: { stripeSessionId: paymentIntent.id },
      data: { status: "failed" },
    })

    console.log(`Payment failed for ${paymentIntent.id}`)
  } catch (error) {
    console.error("Error handling failed payment:", error)
  }
}