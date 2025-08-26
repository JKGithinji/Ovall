"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/Header"
import { SwipeCard } from "@/components/SwipeCard"
import toast from "react-hot-toast"
import type { Session } from "next-auth"

interface Article {
  id: string
  title: string
  content: string
  imageUrl?: string
  sourceUrl?: string
  source?: string
  publishedAt: Date
  isPaid: boolean
  author?: {
    name: string
  }
}

export default function Home() {
  const { data: session } = useSession() as { data: Session | null }
  const [articles, setArticles] = useState<Article[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userScore, setUserScore] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch articles and user data
  const fetchArticles = useCallback(async () => {
    try {
      const url = session?.user?.id 
        ? `/api/articles?userId=${session.user.id}` 
        : '/api/articles'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      } else {
        // Fallback to demo data if API fails
        setArticles(getDemoArticles())
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
      setArticles(getDemoArticles())
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  const fetchUserScore = useCallback(async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch(`/api/user/score?userId=${session.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserScore(data.score)
      }
    } catch (error) {
      console.error('Failed to fetch user score:', error)
    }
  }, [session?.user?.id])

  useEffect(() => {
    fetchArticles()
    if (session?.user?.id) {
      fetchUserScore()
    }
  }, [session, fetchArticles, fetchUserScore])

  const handleSwipe = async (liked: boolean) => {
    if (!session?.user?.id) {
      toast.error('Please sign in to vote!')
      return
    }

    const article = articles[currentIndex]
    if (!article) return

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          liked,
          userId: session.user.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.pointAwarded) {
          setUserScore(prev => prev + 1)
          toast.success(`+1 point! You voted with the majority!`)
        } else {
          toast(`Vote recorded. ${data.message}`)
        }
      }
    } catch (error) {
      console.error('Failed to submit vote:', error)
      toast.error('Failed to submit vote')
    }

    // Move to next card
    setCurrentIndex(prev => prev + 1)

    // Load more articles if running low
    if (currentIndex >= articles.length - 2) {
      fetchArticles()
    }
  }

  const getDemoArticles = (): Article[] => [
    {
      id: '1',
      title: 'Breaking: Major Technology Breakthrough Announced',
      content: 'Scientists have made a significant breakthrough in quantum computing technology that could revolutionize how we process information. This development promises to accelerate computing power exponentially and could have far-reaching implications for various industries including healthcare, finance, and artificial intelligence.',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop',
      sourceUrl: 'https://example.com/tech-breakthrough',
      source: 'Tech News Daily',
      publishedAt: new Date('2024-01-25'),
      isPaid: false,
    },
    {
      id: '2',
      title: 'Climate Change Summit Reaches Historic Agreement',
      content: 'World leaders have reached a unprecedented agreement on climate action at the latest international summit. The agreement includes binding commitments to reduce carbon emissions by 50% within the next decade and massive investments in renewable energy infrastructure.',
      imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=500&h=300&fit=crop',
      sourceUrl: 'https://example.com/climate-summit',
      source: 'Global News Network',
      publishedAt: new Date('2024-01-24'),
      isPaid: false,
    },
    {
      id: '3',
      title: 'New Social Media Platform Promises Better Privacy',
      content: 'A new social media platform has launched with a focus on user privacy and data protection. The platform uses end-to-end encryption and gives users complete control over their data, challenging the current social media landscape dominated by data-hungry giants.',
      imageUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=500&h=300&fit=crop',
      sourceUrl: 'https://example.com/new-social-platform',
      source: 'Digital Privacy Today',
      publishedAt: new Date('2024-01-23'),
      isPaid: true,
      author: { name: 'Privacy Advocate' },
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen">
        <Header userScore={userScore} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to SwipeNews</h1>
            <p className="text-xl text-gray-300 mb-8">Sign in to start swiping through news articles</p>
            <p className="text-gray-400">
              Vote on articles and earn points when you vote with the majority!
            </p>
          </div>
        </div>
      </div>
    )
  }

  const currentArticles = articles.slice(currentIndex, currentIndex + 2)

  return (
    <div className="min-h-screen">
      <Header userScore={userScore} />
      
      <div className="relative h-[calc(100vh-80px)] overflow-hidden">
        {currentArticles.length > 0 ? (
          currentArticles.map((article, index) => (
            <SwipeCard
              key={article.id}
              article={article}
              onSwipe={handleSwipe}
              isTopCard={index === 0}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">No more articles!</h2>
              <p className="text-gray-300">Check back later for new content.</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-white/70 text-sm">
            Swipe right to like • Swipe left to dislike
          </p>
          <p className="text-white/50 text-xs mt-1">
            Earn points by voting with the majority!
          </p>
        </div>
      </div>
    </div>
  )
}
