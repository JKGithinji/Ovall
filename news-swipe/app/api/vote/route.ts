import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
	const user = await prisma.user.findUnique({ where: { email: session.user.email } })
	if (!user) return new NextResponse('Unauthorized', { status: 401 })
	const { targetType, targetId, liked } = await req.json()
	if (!['article','custom'].includes(targetType) || !targetId) return new NextResponse('Bad request', { status: 400 })

	// Upsert the vote
	if (targetType === 'article') {
		await prisma.vote.upsert({
			where: { userId_articleId: { userId: user.id, articleId: targetId } },
			create: { userId: user.id, articleId: targetId, liked },
			update: { liked }
		})
		await prisma.article.update({
			where: { id: targetId },
			data: {
				likeCount: { increment: liked ? 1 : 0 },
				dislikeCount: { increment: liked ? 0 : 1 },
			}
		})
	} else {
		await prisma.vote.upsert({
			where: { userId_customCardId: { userId: user.id, customCardId: targetId } },
			create: { userId: user.id, customCardId: targetId, liked },
			update: { liked }
		})
		await prisma.customCard.update({
			where: { id: targetId },
			data: {
				likeCount: { increment: liked ? 1 : 0 },
				dislikeCount: { increment: liked ? 0 : 1 },
			}
		})
	}

	// Determine majority at the time of vote
	const stats = targetType === 'article'
		? await prisma.article.findUnique({ where: { id: targetId }, select: { likeCount: true, dislikeCount: true } })
		: await prisma.customCard.findUnique({ where: { id: targetId }, select: { likeCount: true, dislikeCount: true } })

	if (stats) {
		const total = (stats.likeCount ?? 0) + (stats.dislikeCount ?? 0)
		if (total >= 3) {
			const majorityLiked = (stats.likeCount ?? 0) >= (stats.dislikeCount ?? 0)
			const userInMajority = liked === majorityLiked
			if (userInMajority) {
				await prisma.user.update({ where: { id: user.id }, data: { score: { increment: 1 } } })
			}
		}
	}

	return NextResponse.json({ ok: true })
}