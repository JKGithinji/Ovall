import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { articleId, customCardId, liked } = await request.json()

    if (!articleId && !customCardId) {
      return NextResponse.json(
        { error: "Either articleId or customCardId is required" },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Create or update the vote
    const vote = await prisma.vote.upsert({
      where: articleId 
        ? { userId_articleId: { userId: user.id, articleId } }
        : { userId_customCardId: { userId: user.id, customCardId } },
      update: { liked },
      create: {
        userId: user.id,
        articleId,
        customCardId,
        liked,
      },
    })

    // Calculate scoring after the vote
    await calculateAndUpdateScore(user.id, articleId, customCardId, liked)

    return NextResponse.json({ success: true, vote })
  } catch (error) {
    console.error('Error processing vote:', error)
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    )
  }
}

async function calculateAndUpdateScore(
  userId: string, 
  articleId?: string, 
  customCardId?: string, 
  userVote?: boolean
) {
  try {
    // Get all votes for this article/card
    const allVotes = await prisma.vote.findMany({
      where: articleId 
        ? { articleId }
        : { customCardId },
    })

    if (allVotes.length < 2) {
      // Need at least 2 votes to determine majority
      return
    }

    const likedVotes = allVotes.filter(vote => vote.liked).length
    const dislikedVotes = allVotes.length - likedVotes
    const majorityLiked = likedVotes > dislikedVotes

    // Find users who voted with the majority
    const majorityVoters = allVotes.filter(vote => vote.liked === majorityLiked)

    // Award points to majority voters
    for (const vote of majorityVoters) {
      await prisma.user.update({
        where: { id: vote.userId },
        data: {
          score: {
            increment: 1
          }
        }
      })
    }

    // Remove points from minority voters (but don't go below 0)
    const minorityVoters = allVotes.filter(vote => vote.liked !== majorityLiked)
    for (const vote of minorityVoters) {
      const user = await prisma.user.findUnique({
        where: { id: vote.userId }
      })
      
      if (user && user.score > 0) {
        await prisma.user.update({
          where: { id: vote.userId },
          data: {
            score: {
              decrement: 1
            }
          }
        })
      }
    }
  } catch (error) {
    console.error('Error calculating scores:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        votes: {
          include: {
            article: true,
            customCard: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        score: user.score,
      },
      votes: user.votes,
    })
  } catch (error) {
    console.error('Error fetching user votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}