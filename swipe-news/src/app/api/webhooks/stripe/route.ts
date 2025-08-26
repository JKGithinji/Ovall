import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handleSuccessfulPayment(paymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  const { userId, articleTitle, articleContent, articleImageUrl } = paymentIntent.metadata

  if (!userId || !articleTitle || !articleContent) {
    console.error("Missing metadata in payment intent")
    return
  }

  try {
    // Create payment record
    await prisma.payment.create({
      data: {
        userId: userId,
        stripePaymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: "succeeded",
        articleTitle,
        articleContent,
        articleImageUrl: articleImageUrl || null,
      },
    })

    // Create the article
    await prisma.article.create({
      data: {
        title: articleTitle,
        content: articleContent,
        imageUrl: articleImageUrl || null,
        publishedAt: new Date(),
        isPaid: true,
        authorId: userId,
      },
    })

    console.log(`Created paid article for payment ${paymentIntent.id}`)
  } catch (error) {
    console.error("Failed to create article from payment:", error)
  }
}