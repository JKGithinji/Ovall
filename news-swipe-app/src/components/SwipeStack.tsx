"use client"

import { useState, useEffect } from "react"
import { SwipeCard } from "./SwipeCard"
import { motion, AnimatePresence } from "framer-motion"

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

interface SwipeStackProps {
  cards: Card[]
  onSwipe: (id: string, liked: boolean, type: 'article' | 'custom') => void
  onEmpty?: () => void
}

export function SwipeStack({ cards, onSwipe, onEmpty }: SwipeStackProps) {
  const [currentCards, setCurrentCards] = useState<Card[]>(cards.slice(0, 3))
  const [cardIndex, setCardIndex] = useState(0)

  useEffect(() => {
    if (cards.length > 0) {
      setCurrentCards(cards.slice(0, Math.min(3, cards.length)))
      setCardIndex(0)
    }
  }, [cards])

  const handleSwipe = (id: string, liked: boolean) => {
    const card = currentCards.find(c => c.id === id)
    if (card) {
      onSwipe(id, liked, card.type)
    }
  }

  const handleRemove = () => {
    const nextIndex = cardIndex + 1
    setCardIndex(nextIndex)

    // Update the stack with the next card
    if (nextIndex + 2 < cards.length) {
      setCurrentCards(prev => [
        ...prev.slice(1),
        cards[nextIndex + 2]
      ])
    } else {
      setCurrentCards(prev => prev.slice(1))
    }

    // Check if we've run out of cards
    if (nextIndex >= cards.length && onEmpty) {
      setTimeout(onEmpty, 500)
    }
  }

  if (currentCards.length === 0) {
    return (
      <div className="relative w-full max-w-sm mx-auto h-[600px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-gray-400 text-2xl">📰</span>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No more cards!</h3>
          <p className="text-gray-500">Check back later for more news to swipe</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px]">
      <AnimatePresence>
        {currentCards.map((card, index) => (
          <motion.div
            key={card.id}
            className="absolute inset-0"
            initial={{ 
              scale: 0.95 - index * 0.05,
              y: index * 8,
              opacity: 1 - index * 0.2
            }}
            animate={{ 
              scale: 0.95 - index * 0.05,
              y: index * 8,
              opacity: 1 - index * 0.2,
              zIndex: currentCards.length - index
            }}
            exit={{ 
              scale: 0.8,
              opacity: 0,
              transition: { duration: 0.2 }
            }}
            style={{
              pointerEvents: index === 0 ? 'auto' : 'none'
            }}
          >
            <SwipeCard
              id={card.id}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              source={card.source}
              url={card.url}
              publishedAt={card.publishedAt}
              onSwipe={handleSwipe}
              onRemove={handleRemove}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}