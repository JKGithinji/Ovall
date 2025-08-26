"use client"
import { useState } from 'react'

export default function CreateCardPage() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		setLoading(true)
		const res = await fetch('/api/stripe/checkout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, description, imageUrl })
		})
		setLoading(false)
		if (!res.ok) {
			setError('Failed to start checkout')
			return
		}
		const data = await res.json()
		if (data.url) window.location.href = data.url
	}

	return (
		<main className="max-w-md mx-auto p-4 min-h-screen">
			<h1 className="text-2xl font-bold mb-4">Create a sponsored card</h1>
			<p className="text-sm text-slate-300 mb-4">Pay to publish a card for players to swipe.</p>
			<form onSubmit={onSubmit} className="space-y-3">
				<input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-3 rounded bg-white/10 outline-none" />
				<textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full px-4 py-3 rounded bg-white/10 outline-none min-h-[120px]" />
				<input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="w-full px-4 py-3 rounded bg-white/10 outline-none" />
				{error && <p className="text-red-400 text-sm">{error}</p>}
				<button disabled={loading} className="w-full px-4 py-3 bg-brand rounded font-semibold">{loading ? 'Loading...' : 'Pay & Publish'}</button>
			</form>
		</main>
	)
}