"use client"

import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { Trophy, User, LogOut, Plus } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  userScore?: number
  onCreateCard?: () => void
  onShowDashboard?: () => void
}

export function Header({ userScore = 0, onCreateCard, onShowDashboard }: HeaderProps) {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">NS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">NewsSwipe</h1>
            </div>
          </div>

          {/* User info and actions */}
          <div className="flex items-center space-x-3">
            {/* Score */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowDashboard}
              className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full hover:bg-yellow-100 transition-colors"
              title="View Dashboard"
            >
              <Trophy size={16} className="text-yellow-600" />
              <span className="text-yellow-800 font-semibold text-sm">{userScore}</span>
            </motion.button>

            {/* Create Card Button */}
            {onCreateCard && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateCard}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                title="Create Custom Card"
              >
                <Plus size={18} />
              </motion.button>
            )}

            {/* User Menu */}
            <div className="relative">
              {session?.user ? (
                <div className="flex items-center space-x-2">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-red-600 p-1 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </motion.button>
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}