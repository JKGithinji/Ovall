import Link from 'next/link'

export default function SuccessPage() {
	return (
		<main className="max-w-md mx-auto p-4 min-h-screen flex flex-col justify-center text-center">
			<h1 className="text-2xl font-bold mb-2">Payment successful</h1>
			<p className="text-slate-300 mb-6">Your card will be shown to players shortly.</p>
			<Link href="/swipe" className="px-4 py-3 bg-brand rounded font-semibold">Go play</Link>
		</main>
	)
}