import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) return NextResponse.json({ score: 0 })
	const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { score: true } })
	return NextResponse.json({ score: user?.score ?? 0 })
}