import Link from 'next/link'

export default function HomePage() {
	return (
		<main className="flex flex-col items-center justify-between min-h-screen">
			<header className="w-full p-4 sticky top-0 bg-black/40 backdrop-blur">
				<div className="max-w-md mx-auto flex items-center justify-between">
					<h1 className="text-xl font-bold">News Swipe</h1>
					<div className="flex items-center gap-2">
						<Link href="/swipe" className="px-3 py-2 bg-brand rounded-md text-sm font-semibold">Play</Link>
						<Link href="/create" className="px-3 py-2 bg-white/10 rounded-md text-sm font-semibold">Create</Link>
					</div>
				</div>
			</header>
			<section className="flex-1 w-full">
				<div className="max-w-md mx-auto p-4">
					<h2 className="text-2xl font-semibold mb-2">Agree with the crowd to score</h2>
					<p className="text-slate-300 mb-6">Swipe right to like, left to dislike. If you match the majority, you earn points.</p>
					<div className="grid grid-cols-2 gap-3">
						<Link href="/auth/signup" className="px-4 py-3 bg-brand rounded-lg text-center font-semibold">Sign up</Link>
						<Link href="/auth/signin" className="px-4 py-3 bg-white/10 rounded-lg text-center font-semibold">Sign in</Link>
					</div>
				</div>
			</section>
			<footer className="w-full p-4">
				<div className="max-w-md mx-auto text-center text-xs text-slate-400">Create sponsored cards with Stripe to see how the crowd reacts.</div>
			</footer>
		</main>
	)
}