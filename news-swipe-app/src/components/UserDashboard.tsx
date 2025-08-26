"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Heart, X, Calendar, ExternalLink } from "lucide-react"

interface Vote {
  id: string
  liked: boolean
  createdAt: string
  article?: {
    id: string
    title: string
    source: string
    url: string
  }
  customCard?: {
    id: string
    title: string
  }
}

interface UserStats {
  totalVotes: number
  correctPredictions: number
  accuracy: number
  streak: number
  rank: number
}

interface DashboardProps {
  onClose: () => void
}

export function UserDashboard({ onClose }: DashboardProps) {
  const [user, setUser] = useState<{id: string, name: string, email: string, score: number} | null>(null)
  const [votes, setVotes] = useState<Vote[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load user data and votes
      const response = await fetch("/api/vote")
      const data = await response.json()
      
      if (data.user && data.votes) {
        setUser(data.user)
        setVotes(data.votes)
        
        // Calculate stats
        const totalVotes = data.votes.length
        const correctPredictions = Math.floor(totalVotes * 0.65) // Simulated accuracy
        const accuracy = totalVotes > 0 ? (correctPredictions / totalVotes) * 100 : 0
        
        setStats({
          totalVotes,
          correctPredictions,
          accuracy,
          streak: Math.floor(Math.random() * 10) + 1, // Simulated streak
          rank: Math.floor(Math.random() * 1000) + 1, // Simulated rank
        })
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Dashboard</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          )}

          {/* Score Display */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="text-white" size={24} />
              <span className="text-white text-2xl font-bold">{user?.score || 0}</span>
            </div>
            <p className="text-white text-sm">Total Points</p>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-blue-600 text-xl font-bold">{stats.totalVotes}</div>
                <div className="text-blue-800 text-xs">Total Votes</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-green-600 text-xl font-bold">{stats.accuracy.toFixed(1)}%</div>
                <div className="text-green-800 text-xs">Accuracy</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-purple-600 text-xl font-bold">{stats.streak}</div>
                <div className="text-purple-800 text-xs">Win Streak</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-orange-600 text-xl font-bold">#{stats.rank}</div>
                <div className="text-orange-800 text-xs">Global Rank</div>
              </div>
            </div>
          )}

          {/* Recent Votes */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Recent Votes</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {votes.slice(0, 10).map((vote) => (
                <motion.div
                  key={vote.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {vote.article?.title || vote.customCard?.title || "Unknown"}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(vote.createdAt).toLocaleDateString()}
                      </span>
                      {vote.article?.source && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                          {vote.article.source}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {vote.liked ? (
                      <Heart className="text-green-500" size={16} />
                    ) : (
                      <X className="text-red-500" size={16} />
                    )}
                    {vote.article?.url && vote.article.url !== "#" && (
                      <a
                        href={vote.article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {votes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No votes yet. Start swiping to see your history!</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-semibold text-blue-800 mb-2">💡 Tips to Improve</h5>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Vote with the crowd to earn points</li>
              <li>• Check trending topics for popular opinions</li>
              <li>• Create engaging custom cards for others to vote on</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}