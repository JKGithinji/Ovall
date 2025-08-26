"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function SignUpPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		setSuccess('')
		const res = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, name })
		})
		if (!res.ok) {
			const msg = await res.text()
			setError(msg || 'Failed to sign up')
			return
		}
		setSuccess('Account created. You can sign in now.')
	}

	return (
		<main className="max-w-md mx-auto p-4 min-h-screen flex flex-col justify-center">
			<h1 className="text-2xl font-bold mb-6">Sign up</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="w-full px-4 py-3 rounded bg-white/10 outline-none" />
				<input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full px-4 py-3 rounded bg-white/10 outline-none" />
				<input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-4 py-3 rounded bg-white/10 outline-none" />
				{error && <p className="text-red-400 text-sm">{error}</p>}
				{success && <p className="text-emerald-400 text-sm">{success}</p>}
				<button type="submit" className="w-full px-4 py-3 bg-brand rounded font-semibold">Create account</button>
			</form>
			<p className="text-sm mt-4 text-slate-300">Have an account? <Link className="underline" href="/auth/signin">Sign in</Link></p>
		</main>
	)
}