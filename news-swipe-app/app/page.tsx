"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import SwipeCard from "@/components/SwipeCard";
import toast from "react-hot-toast";
import { Trophy, Plus, LogOut, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  source?: string | null;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchArticles();
      fetchUserPoints();
    }
  }, [status, router]);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (error) {
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const res = await fetch("/api/user/stats");
      if (res.ok) {
        const data = await res.json();
        setPoints(data.points);
      }
    } catch (error) {
      console.error("Failed to fetch points");
    }
  };

  const handleVote = async (liked: boolean) => {
    const article = articles[currentIndex];
    
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: article.id, liked }),
      });

      if (res.ok) {
        const data = await res.json();
        setPoints(data.totalPoints);
        
        if (data.pointsEarned > 0) {
          toast.success(
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>+1 Point! You voted with the majority!</span>
            </div>,
            { duration: 3000 }
          );
        } else if (data.stats.total >= 2) {
          toast.error("No points - you voted with the minority", { duration: 2000 });
        } else {
          toast("Vote recorded! Waiting for more votes...", { duration: 2000 });
        }

        // Move to next article
        setCurrentIndex(prev => prev + 1);
      }
    } catch (error) {
      toast.error("Failed to record vote");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];
  const nextArticle = articles[currentIndex + 1];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-bold text-lg">{points} pts</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/create-card"
              className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full"
            >
              <Plus className="w-5 h-5 text-white" />
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {currentArticle ? (
            <div className="relative h-[600px]">
              <AnimatePresence>
                {nextArticle && (
                  <SwipeCard
                    key={nextArticle.id}
                    article={nextArticle}
                    onVote={() => {}}
                    isTop={false}
                  />
                )}
                <SwipeCard
                  key={currentArticle.id}
                  article={currentArticle}
                  onVote={handleVote}
                  isTop={true}
                />
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  No more articles!
                </h2>
                <p className="text-white/70 mb-6">
                  Check back later for more news to swipe through
                </p>
                <Link
                  href="/create-card"
                  className="inline-flex items-center gap-2 bg-white text-purple-900 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Your Own Card
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
