"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Menu, User, Trophy, Plus, LogOut } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface HeaderProps {
  userScore?: number
}

export function Header({ userScore = 0 }: HeaderProps) {
  const { data: session } = useSession()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="relative z-30 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          SwipeNews
        </Link>

        {/* Score Display */}
        {session && (
          <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
            <Trophy className="text-yellow-400" size={16} />
            <span className="text-white font-semibold">{userScore}</span>
          </div>
        )}

        {/* User Menu */}
        <div className="relative">
          {session ? (
            <>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 bg-white/10 rounded-full p-2"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <User className="text-white" size={20} />
                )}
                <Menu className="text-white" size={16} />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg min-w-48 py-2">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{session.user?.name}</p>
                    <p className="text-sm text-gray-600">{session.user?.email}</p>
                  </div>
                  
                  <Link
                    href="/create-article"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    <Plus size={16} />
                    <span>Create Article</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      signOut()
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}