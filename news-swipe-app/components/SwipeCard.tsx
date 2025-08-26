"use client";

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { useState } from "react";
import { Heart, X } from "lucide-react";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  source?: string | null;
}

interface SwipeCardProps {
  article: Article;
  onVote: (liked: boolean) => void;
  isTop: boolean;
}

export default function SwipeCard({ article, onVote, isTop }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const controls = useAnimation();

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      setExitX(info.offset.x > 0 ? 300 : -300);
      onVote(info.offset.x > 0);
    } else {
      controls.start({ x: 0 });
    }
  };

  const handleButtonVote = async (liked: boolean) => {
    const exitDirection = liked ? 300 : -300;
    await controls.start({ x: exitDirection, opacity: 0 });
    onVote(liked);
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 rounded-2xl bg-white shadow-xl overflow-hidden scale-95 opacity-50">
        <div className="h-full p-6 flex flex-col">
          <div className="flex-1">
            {article.imageUrl && (
              <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <h2 className="text-xl font-bold mb-3 text-gray-900">{article.title}</h2>
            <p className="text-gray-600 line-clamp-4">{article.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl bg-white shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      exit={{ x: exitX, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="h-full p-6 flex flex-col relative">
        {/* Like/Dislike indicators */}
        <motion.div
          className="absolute top-8 left-8 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-xl rotate-[-20deg] pointer-events-none"
          style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        >
          LIKE
        </motion.div>
        <motion.div
          className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-xl rotate-[20deg] pointer-events-none"
          style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
        >
          NOPE
        </motion.div>

        <div className="flex-1">
          {article.imageUrl && (
            <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <h2 className="text-xl font-bold mb-3 text-gray-900">{article.title}</h2>
          <p className="text-gray-600 line-clamp-4">{article.description}</p>
          
          {article.source && (
            <p className="text-sm text-gray-400 mt-4">Source: {article.source}</p>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => handleButtonVote(false)}
            className="flex-1 bg-gray-100 hover:bg-red-100 transition-colors rounded-full py-4 flex items-center justify-center"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          <button
            onClick={() => handleButtonVote(true)}
            className="flex-1 bg-gray-100 hover:bg-green-100 transition-colors rounded-full py-4 flex items-center justify-center"
          >
            <Heart className="w-8 h-8 text-green-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}