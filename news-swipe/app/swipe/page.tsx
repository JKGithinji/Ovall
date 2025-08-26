"use client"
import { useEffect, useState } from 'react'
import SwipeCard from '@/components/SwipeCard'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'

type Item = {
	id: string
	type: 'article' | 'custom'
	title: string
	summary: string
	imageUrl?: string
}

export default function SwipePage() {
	const { data: session, status } = useSession()
	const [queue, setQueue] = useState<Item[]>([])
	const [score, setScore] = useState<number>(0)
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		if (status === 'unauthenticated') return
		loadMore()
		refreshScore()
	}, [status])

	async function refreshScore() {
		const res = await fetch('/api/me')
		if (res.ok) {
			const data = await res.json()
			setScore(data.score || 0)
		}
	}

	async function loadMore() {
		if (loading) return
		setLoading(true)
		const res = await fetch('/api/queue')
		const data = await res.json()
		setQueue(prev => [...prev, ...data.items])
		setLoading(false)
	}

	async function vote(dir: 'left' | 'right') {
		const current = queue[0]
		if (!current) return
		setQueue(q => q.slice(1))
		const liked = dir === 'right'
		await fetch('/api/vote', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ targetType: current.type, targetId: current.id, liked })
		})
		const res = await fetch('/api/score')
		if (res.ok) {
			const data = await res.json()
			setScore(data.score)
		}
		if (queue.length < 3) loadMore()
	}

	if (status === 'unauthenticated') {
		return (
			<main className="max-w-md mx-auto p-4 min-h-screen flex flex-col justify-center text-center">
				<p className="mb-4">Please sign in to play.</p>
				<div className="grid grid-cols-2 gap-3">
					<Link href="/auth/signup" className="px-4 py-3 bg-brand rounded-lg text-center font-semibold">Sign up</Link>
					<button onClick={()=>signIn()} className="px-4 py-3 bg-white/10 rounded-lg text-center font-semibold">Sign in</button>
				</div>
			</main>
		)
	}

	return (
		<main className="min-h-screen flex flex-col">
			<header className="w-full p-4 sticky top-0 bg-black/40 backdrop-blur z-10">
				<div className="max-w-md mx-auto flex items-center justify-between">
					<h1 className="text-xl font-bold">Play</h1>
					<div className="px-3 py-2 bg-white/10 rounded-md text-sm">Score: {score}</div>
				</div>
			</header>
			<section className="flex-1 w-full">
				<div className="max-w-md mx-auto p-4 space-y-4">
					{queue.length > 0 ? (
						<SwipeCard
							title={queue[0].title}
							summary={queue[0].summary}
							imageUrl={queue[0].imageUrl}
							onSwipe={vote}
						/>
					) : (
						<div className="text-center text-slate-300">Loading cards...</div>
					)}
					<div className="grid grid-cols-2 gap-4">
						<button onClick={()=>vote('left')} className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30">Dislike</button>
						<button onClick={()=>vote('right')} className="px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">Like</button>
					</div>
				</div>
			</section>
		</main>
	)
}