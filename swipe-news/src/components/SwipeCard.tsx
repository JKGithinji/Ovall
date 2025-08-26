"use client"

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { useState } from "react"
import { Heart, X, ExternalLink, Calendar, User } from "lucide-react"
import Image from "next/image"

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

interface SwipeCardProps {
  article: Article
  onSwipe: (liked: boolean) => void
  isTopCard: boolean
}

export function SwipeCard({ article, onSwipe, isTopCard }: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 300], [-30, 30])
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0])
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const dislikeOpacity = useTransform(x, [0, -100], [0, 1])

  const [exitX, setExitX] = useState(0)

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    if (Math.abs(info.offset.x) > threshold) {
      setExitX(info.offset.x > 0 ? 1000 : -1000)
      onSwipe(info.offset.x > 0)
    }
  }

  const handleButtonSwipe = (liked: boolean) => {
    setExitX(liked ? 1000 : -1000)
    onSwipe(liked)
  }

  return (
    <motion.div
      className={`absolute inset-4 ${isTopCard ? 'z-20' : 'z-10'} card-container no-select`}
      style={{
        x,
        rotate,
        opacity: isTopCard ? opacity : 0.8,
        scale: isTopCard ? 1 : 0.95,
      }}
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileTap={isTopCard ? { scale: 0.95 } : {}}
    >
      <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-4 left-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm md:text-lg md:top-8 md:left-8 md:px-4 md:py-2"
          style={{ opacity: likeOpacity }}
        >
          <Heart className="inline mr-1 md:mr-2" size={16} />
          LIKE
        </motion.div>
        
        <motion.div
          className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm md:text-lg md:top-8 md:right-8 md:px-4 md:py-2"
          style={{ opacity: dislikeOpacity }}
        >
          <X className="inline mr-1 md:mr-2" size={16} />
          NOPE
        </motion.div>

        {/* Article Image */}
        {article.imageUrl && (
          <div className="relative w-full h-48 md:h-64">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={isTopCard}
            />
            {article.isPaid && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold md:top-4 md:left-4">
                SPONSORED
              </div>
            )}
          </div>
        )}

        {/* Article Content */}
        <div className="p-4 md:p-6 text-gray-900 h-full flex flex-col">
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 line-clamp-3 leading-tight">
            {article.title}
          </h2>
          
          <div className="flex-1 overflow-hidden">
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-6">
              {article.content}
            </p>
          </div>

          {/* Article Meta */}
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3 md:space-x-4">
                {article.source && (
                  <div className="flex items-center">
                    <User size={10} className="mr-1" />
                    <span className="truncate max-w-20 md:max-w-none">{article.source}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar size={10} className="mr-1" />
                  {new Date(article.publishedAt).toLocaleDateString()}
                </div>
              </div>
              {article.sourceUrl && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-500 hover:text-blue-700 touch-target"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={10} className="mr-1" />
                  <span className="hidden md:inline">Read More</span>
                  <span className="md:hidden">Read</span>
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isTopCard && (
            <div className="flex justify-center space-x-6 md:space-x-8 mt-4 md:mt-6">
              <button
                onClick={() => handleButtonSwipe(false)}
                className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full p-3 md:p-4 shadow-lg transition-colors touch-target"
                aria-label="Dislike article"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => handleButtonSwipe(true)}
                className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-full p-3 md:p-4 shadow-lg transition-colors touch-target"
                aria-label="Like article"
              >
                <Heart size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}