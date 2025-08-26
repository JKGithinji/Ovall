import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { articleId, liked, userId } = await request.json()

    if (!articleId || typeof liked !== "boolean" || !userId) {
      return NextResponse.json({ error: "Invalid data - articleId, liked, and userId are required" }, { status: 400 })
    }

    // Check if user already voted on this article
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_articleId: {
          userId: userId,
          articleId: articleId,
        },
      },
    })

    if (existingVote) {
      return NextResponse.json({ error: "Already voted on this article" }, { status: 400 })
    }

    // Create the vote
    await prisma.vote.create({
      data: {
        userId: userId,
        articleId: articleId,
        liked: liked,
      },
    })

    // Calculate if user should get a point (majority voting)
    const allVotes = await prisma.vote.findMany({
      where: { articleId: articleId },
    })

    const totalVotes = allVotes.length
    const likedVotes = allVotes.filter(vote => vote.liked).length
    const dislikedVotes = totalVotes - likedVotes

    let pointAwarded = false
    let message = "Vote recorded!"

    // Award point if user voted with the majority (need at least 3 votes to determine majority)
    if (totalVotes >= 3) {
      const userVotedWithMajority = 
        (liked && likedVotes > dislikedVotes) || 
        (!liked && dislikedVotes > likedVotes)

      if (userVotedWithMajority) {
        // Award point to user
        await prisma.user.update({
          where: { id: userId },
          data: { score: { increment: 1 } },
        })
        pointAwarded = true
        message = "You voted with the majority!"
      } else {
        message = "You voted with the minority. No points awarded."
      }
    } else {
      message = `Vote recorded. ${3 - totalVotes} more votes needed to determine majority.`
    }

    return NextResponse.json({
      success: true,
      pointAwarded,
      message,
      totalVotes,
      likedVotes,
      dislikedVotes,
    })

  } catch (error) {
    console.error("Vote error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}