import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(req: NextRequest) {
	try {
		const { email, password, name } = await req.json()
		if (!email || !password) return new NextResponse('Missing email or password', { status: 400 })
		const exists = await prisma.user.findUnique({ where: { email } })
		if (exists) return new NextResponse('Email already in use', { status: 400 })
		const passwordHash = await hash(password, 10)
		await prisma.user.create({ data: { email, passwordHash, name } })
		return NextResponse.json({ ok: true })
	} catch (e) {
		return new NextResponse('Invalid request', { status: 400 })
	}
}