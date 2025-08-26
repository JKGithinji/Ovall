"use client"
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function SignInPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		const res = await signIn('credentials', { email, password, redirect: true, callbackUrl: '/swipe' })
		if (res?.error) setError('Invalid credentials')
	}

	return (
		<main className="max-w-md mx-auto p-4 min-h-screen flex flex-col justify-center">
			<h1 className="text-2xl font-bold mb-6">Sign in</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full px-4 py-3 rounded bg-white/10 outline-none" />
				<input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-4 py-3 rounded bg-white/10 outline-none" />
				{error && <p className="text-red-400 text-sm">{error}</p>}
				<button type="submit" className="w-full px-4 py-3 bg-brand rounded font-semibold">Sign in</button>
			</form>
			<p className="text-sm mt-4 text-slate-300">No account? <Link className="underline" href="/auth/signup">Sign up</Link></p>
		</main>
	)
}