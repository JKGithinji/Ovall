import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { fetchNews } from "@/lib/news"

export async function GET(request: NextRequest) {
  try {
    // First, try to get articles from database
    let articles = await prisma.article.findMany({
      where: { isActive: true },
      orderBy: { publishedAt: 'desc' },
      take: 20
    })

    // If no articles in database or they're old, fetch fresh ones
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const needsFreshData = articles.length === 0 || 
      (articles[0] && articles[0].createdAt < oneHourAgo)

    if (needsFreshData) {
      console.log('Fetching fresh news data...')
      const newsArticles = await fetchNews()
      
      // Save new articles to database
      const savedArticles = await Promise.allSettled(
        newsArticles.map(async (article) => {
          return prisma.article.upsert({
            where: { url: article.url },
            update: {
              title: article.title,
              description: article.description,
              imageUrl: article.urlToImage,
              source: article.source.name,
              publishedAt: new Date(article.publishedAt),
              isActive: true,
            },
            create: {
              title: article.title,
              description: article.description,
              url: article.url,
              imageUrl: article.urlToImage,
              source: article.source.name,
              publishedAt: new Date(article.publishedAt),
              isActive: true,
            },
          })
        })
      )

      // Get updated articles from database
      articles = await prisma.article.findMany({
        where: { isActive: true },
        orderBy: { publishedAt: 'desc' },
        take: 20
      })
    }

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}