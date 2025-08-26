import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")
    const userId = searchParams.get("userId")

    // Get articles from database (including paid articles)
    const articles = await prisma.article.findMany({
      where: {
        isActive: true,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    // If user ID is provided, filter out articles they've already voted on
    let filteredArticles = articles
    if (userId) {
      const userVotes = await prisma.vote.findMany({
        where: { userId: userId },
        select: { articleId: true },
      })
      
      const votedArticleIds = userVotes.map(vote => vote.articleId)
      filteredArticles = articles.filter(article => !votedArticleIds.includes(article.id))
    }

    // If we don't have enough articles, try to fetch from news API
    if (filteredArticles.length < 5) {
      await fetchAndStoreNewsArticles()
    }

    return NextResponse.json(filteredArticles)

  } catch (error) {
    console.error("Articles fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function fetchAndStoreNewsArticles() {
  if (!process.env.NEWS_API_KEY) {
    console.log("No NEWS_API_KEY configured, skipping news fetch")
    return
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch news")
    }

    const data = await response.json()
    
    for (const newsArticle of data.articles) {
      if (!newsArticle.title || !newsArticle.description) continue

      // Check if article already exists
      const existing = await prisma.article.findFirst({
        where: {
          title: newsArticle.title,
        },
      })

      if (!existing) {
        await prisma.article.create({
          data: {
            title: newsArticle.title,
            content: newsArticle.description + (newsArticle.content ? `\n\n${newsArticle.content}` : ""),
            imageUrl: newsArticle.urlToImage,
            sourceUrl: newsArticle.url,
            source: newsArticle.source?.name,
            publishedAt: new Date(newsArticle.publishedAt),
            isPaid: false,
          },
        })
      }
    }
  } catch (error) {
    console.error("Failed to fetch news articles:", error)
  }
}