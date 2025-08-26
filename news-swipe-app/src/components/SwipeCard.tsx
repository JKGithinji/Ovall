"use client"

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { Heart, X, ExternalLink } from "lucide-react"

interface SwipeCardProps {
  id: string
  title: string
  description?: string
  imageUrl?: string
  source: string
  url: string
  publishedAt: Date
  onSwipe: (id: string, liked: boolean) => void
  onRemove: () => void
}

export function SwipeCard({
  id,
  title,
  description,
  imageUrl,
  source,
  url,
  publishedAt,
  onSwipe,
  onRemove,
}: SwipeCardProps) {
  const [exitX, setExitX] = useState(0)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    
    if (info.offset.x > threshold) {
      // Swipe right - like
      setExitX(200)
      onSwipe(id, true)
      setTimeout(onRemove, 300)
    } else if (info.offset.x < -threshold) {
      // Swipe left - dislike
      setExitX(-200)
      onSwipe(id, false)
      setTimeout(onRemove, 300)
    }
  }

  const handleButtonClick = (liked: boolean) => {
    setExitX(liked ? 200 : -200)
    onSwipe(id, liked)
    setTimeout(onRemove, 300)
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileDrag={{ scale: 1.02 }}
    >
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-64 bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-6xl font-bold">
                {source.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Swipe indicators */}
          <motion.div
            className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg"
            style={{
              opacity: useTransform(x, [-100, -50, 0], [1, 0.5, 0]),
            }}
          >
            NOPE
          </motion.div>
          
          <motion.div
            className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg"
            style={{
              opacity: useTransform(x, [0, 50, 100], [0, 0.5, 1]),
            }}
          >
            LIKE
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {source}
            </span>
            <span className="text-xs text-gray-500">
              {publishedAt.toLocaleDateString()}
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-3">
            {title}
          </h2>
          
          {description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-4 flex-1">
              {description}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-auto pt-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleButtonClick(false)}
              className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <X size={24} />
            </motion.button>

            <motion.a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ExternalLink size={16} />
              <span className="text-sm">Read More</span>
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleButtonClick(true)}
              className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <Heart size={24} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}