import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
	// Fetch newest articles and paid custom cards
	const [articles, customs] = await Promise.all([
		prisma.article.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
		prisma.customCard.findMany({ where: { paymentStatus: 'paid' }, orderBy: { createdAt: 'desc' }, take: 5 })
	])
	const items = [
		...articles.map(a=>({ id: a.id, type: 'article' as const, title: a.title, summary: a.summary, imageUrl: a.imageUrl })),
		...customs.map(c=>({ id: c.id, type: 'custom' as const, title: c.title, summary: c.description, imageUrl: c.imageUrl }))
	]
	// Simple shuffle
	for (let i = items.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[items[i], items[j]] = [items[j], items[i]]
	}
	return NextResponse.json({ items })
}