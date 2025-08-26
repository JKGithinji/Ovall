import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function fetchRSS(url: string) {
	const res = await fetch(url)
	const xml = await res.text()
	return xml
}

function parseSimpleRSS(xml: string) {
	const itemRegex = /<item>[\s\S]*?<\/item>/g
	const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/
	const linkRegex = /<link>(.*?)<\/link>/
	const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/
	const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/
	const items = xml.match(itemRegex) || []
	return items.slice(0, 30).map(i => {
		const t = i.match(titleRegex)
		const l = i.match(linkRegex)
		const d = i.match(descRegex)
		const p = i.match(pubDateRegex)
		return {
			title: (t?.[1] || t?.[2] || 'Untitled').trim(),
			url: (l?.[1] || '').trim(),
			summary: ((d?.[1] || d?.[2] || '').replace(/<[^>]*>/g, '').slice(0, 280)).trim(),
			publishedAt: p?.[1] ? new Date(p[1]) : null,
		}
	})
}

export async function POST() {
	// Example RSS: BBC world
	const xml = await fetchRSS('https://feeds.bbci.co.uk/news/world/rss.xml')
	const items = parseSimpleRSS(xml)
	let created = 0
	for (const it of items) {
		if (!it.url) continue
		const exists = await prisma.article.findFirst({ where: { url: it.url } })
		if (exists) continue
		await prisma.article.create({ data: {
			title: it.title,
			summary: it.summary || it.title,
			url: it.url,
			source: 'BBC',
			publishedAt: it.publishedAt ?? undefined,
		}})
		created++
	}
	return NextResponse.json({ created })
}