import { NextRequest, NextResponse } from "next/server"
import { stripe, ARTICLE_CREATION_PRICE } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { articleTitle, articleContent, articleImageUrl, userId } = await request.json()

    if (!articleTitle || !articleContent || !userId) {
      return NextResponse.json({ error: "Article title, content, and userId are required" }, { status: 400 })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ARTICLE_CREATION_PRICE,
      currency: "usd",
      metadata: {
        userId: userId,
        articleTitle,
        articleContent,
        articleImageUrl: articleImageUrl || "",
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: ARTICLE_CREATION_PRICE,
    })

  } catch (error) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}