import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get articles that the user hasn't voted on yet
    const votedArticleIds = await prisma.vote.findMany({
      where: { userId: session.user.id },
      select: { articleId: true }
    });

    const votedIds = votedArticleIds.map(v => v.articleId);

    const articles = await prisma.article.findMany({
      where: {
        id: { notIn: votedIds }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, imageUrl, source } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        description,
        imageUrl,
        source,
        authorId: session.user.id,
        isUserCreated: true
      }
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}