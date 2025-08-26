import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId, liked } = await req.json();

    if (!articleId || liked === undefined) {
      return NextResponse.json(
        { error: "Article ID and vote are required" },
        { status: 400 }
      );
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId
        }
      }
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "Already voted on this article" },
        { status: 400 }
      );
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        userId: session.user.id,
        articleId,
        liked
      }
    });

    // Calculate if user wins points
    const allVotes = await prisma.vote.findMany({
      where: { articleId }
    });

    const likes = allVotes.filter(v => v.liked).length;
    const dislikes = allVotes.filter(v => !v.liked).length;
    const total = allVotes.length;

    let pointsEarned = 0;
    let withMajority = false;

    if (total >= 2) { // Need at least 2 votes to determine majority
      if (liked && likes > dislikes) {
        pointsEarned = 1;
        withMajority = true;
      } else if (!liked && dislikes > likes) {
        pointsEarned = 1;
        withMajority = true;
      }

      if (pointsEarned > 0) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { points: { increment: pointsEarned } }
        });
      }
    }

    // Get updated user points
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true }
    });

    return NextResponse.json({
      vote,
      pointsEarned,
      withMajority,
      totalPoints: user?.points || 0,
      stats: {
        likes,
        dislikes,
        total
      }
    });
  } catch (error) {
    console.error("Error voting:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}