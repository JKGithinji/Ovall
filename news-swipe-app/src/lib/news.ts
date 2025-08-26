interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string
  source: {
    name: string
  }
  publishedAt: string
}

interface NewsResponse {
  articles: NewsArticle[]
  totalResults: number
}

export async function fetchNews(page = 1, pageSize = 20): Promise<NewsArticle[]> {
  try {
    // If no API key is provided, return mock data for development
    if (!process.env.NEWS_API_KEY || process.env.NEWS_API_KEY === 'your-news-api-key') {
      return getMockNews()
    }

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&page=${page}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    )

    if (!response.ok) {
      console.error('News API error:', response.statusText)
      return getMockNews()
    }

    const data: NewsResponse = await response.json()
    return data.articles.filter(article => 
      article.title && 
      article.url && 
      article.source?.name &&
      article.title !== '[Removed]'
    )
  } catch (error) {
    console.error('Error fetching news:', error)
    return getMockNews()
  }
}

function getMockNews(): NewsArticle[] {
  return [
    {
      title: "Tech Giants Report Strong Q4 Earnings",
      description: "Major technology companies continue to show robust growth despite economic uncertainties, with cloud services leading the charge.",
      url: "https://example.com/tech-earnings",
      urlToImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      source: { name: "TechCrunch" },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      title: "Climate Summit Reaches Historic Agreement",
      description: "World leaders announce unprecedented commitment to renewable energy transition and carbon neutrality goals.",
      url: "https://example.com/climate-summit",
      urlToImage: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=300&fit=crop",
      source: { name: "Reuters" },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    },
    {
      title: "New Study Reveals Benefits of Remote Work",
      description: "Comprehensive research shows increased productivity and employee satisfaction in hybrid work environments.",
      url: "https://example.com/remote-work-study",
      urlToImage: "https://images.unsplash.com/photo-1664475463253-4b2bb8b3c2e7?w=400&h=300&fit=crop",
      source: { name: "Harvard Business Review" },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    },
    {
      title: "Breakthrough in Quantum Computing Announced",
      description: "Scientists achieve significant milestone in quantum error correction, bringing practical quantum computers closer to reality.",
      url: "https://example.com/quantum-breakthrough",
      urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
      source: { name: "Nature" },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    },
    {
      title: "Global Markets Show Mixed Signals",
      description: "International stock markets display volatility as investors react to latest economic indicators and policy changes.",
      url: "https://example.com/market-update",
      urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
      source: { name: "Financial Times" },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
    },
    {
      title: "Space Mission Discovers Water on Mars",
      description: "Latest rover findings provide compelling evidence of subsurface water reservoirs on the Red Planet.",
      url: "https://example.com/mars-water",
      urlToImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop",
      source: { name: "NASA" },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    },
    {
      title: "AI Model Achieves Medical Diagnosis Breakthrough",
      description: "New artificial intelligence system demonstrates unprecedented accuracy in early disease detection across multiple conditions.",
      url: "https://example.com/ai-medical",
      urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      source: { name: "Medical Journal" },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), // 14 hours ago
    },
    {
      title: "Renewable Energy Costs Hit Record Low",
      description: "Solar and wind power generation costs continue to decline, making clean energy more competitive than ever.",
      url: "https://example.com/renewable-costs",
      urlToImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop",
      source: { name: "Energy Today" },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(), // 16 hours ago
    },
  ]
}