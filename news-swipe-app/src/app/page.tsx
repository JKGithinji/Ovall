"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/Header"
import { SwipeStack } from "@/components/SwipeStack"
import { CreateCardForm } from "@/components/CreateCardForm"
import { UserDashboard } from "@/components/UserDashboard"

interface Article {
  id: string
  title: string
  description?: string
  imageUrl?: string
  source: string
  url: string
  publishedAt: string
}

interface CustomCard {
  id: string
  title: string
  description: string
  imageUrl?: string
  createdBy: string
  isPaid: boolean
  createdAt: string
}

interface Card {
  id: string
  title: string
  description?: string
  imageUrl?: string
  source: string
  url: string
  publishedAt: Date
  type: 'article' | 'custom'
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cards, setCards] = useState<Card[]>([])
  const [userScore, setUserScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/signin")
      return
    }

    loadCards()
    loadUserData()
  }, [session, status, router])

  const loadCards = async () => {
    try {
      setLoading(true)
      
      // Load articles and custom cards in parallel
      const [articlesRes, customCardsRes] = await Promise.all([
        fetch("/api/articles"),
        fetch("/api/custom-cards")
      ])

      const articles: Article[] = await articlesRes.json()
      const customCards: CustomCard[] = customCardsRes.json ? await customCardsRes.json() : []

      // Convert to unified card format
      const articleCards: Card[] = articles.map(article => ({
        id: article.id,
        title: article.title,
        description: article.description,
        imageUrl: article.imageUrl,
        source: article.source,
        url: article.url,
        publishedAt: new Date(article.publishedAt),
        type: 'article' as const
      }))

      const customCardItems: Card[] = customCards.map(card => ({
        id: card.id,
        title: card.title,
        description: card.description,
        imageUrl: card.imageUrl,
        source: "Custom",
        url: "#",
        publishedAt: new Date(card.createdAt),
        type: 'custom' as const
      }))

      // Shuffle and combine cards
      const allCards = [...articleCards, ...customCardItems]
      const shuffledCards = allCards.sort(() => Math.random() - 0.5)
      
      setCards(shuffledCards)
    } catch (error) {
      console.error("Error loading cards:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = async () => {
    try {
      const response = await fetch("/api/vote")
      const data = await response.json()
      
      if (data.user) {
        setUserScore(data.user.score)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const handleSwipe = async (id: string, liked: boolean, type: 'article' | 'custom') => {
    try {
      const payload = type === 'article' 
        ? { articleId: id, liked }
        : { customCardId: id, liked }

      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        // Reload user data to get updated score
        loadUserData()
      }
    } catch (error) {
      console.error("Error submitting vote:", error)
    }
  }

  const handleCreateCardSuccess = () => {
    // Reload cards to include the new custom card
    loadCards()
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userScore={userScore} 
        onCreateCard={() => setShowCreateForm(true)}
        onShowDashboard={() => setShowDashboard(true)}
      />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Swipe to Vote
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
                         Swipe right if you like the content, left if you don&apos;t. 
             Earn points for voting with the majority!
          </p>
        </motion.div>

        <SwipeStack
          cards={cards}
          onSwipe={handleSwipe}
          onEmpty={() => {
            // Could show a message or reload cards
            setTimeout(loadCards, 1000)
          }}
        />

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">←</span>
              </div>
              <span>Dislike</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">→</span>
              </div>
              <span>Like</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Create Card Modal */}
      {showCreateForm && (
        <CreateCardForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateCardSuccess}
        />
      )}

      {/* User Dashboard Modal */}
      {showDashboard && (
        <UserDashboard
          onClose={() => setShowDashboard(false)}
        />
      )}
    </div>
  )
}
