import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' })

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
	const user = await prisma.user.findUnique({ where: { email: session.user.email } })
	if (!user) return new NextResponse('Unauthorized', { status: 401 })
	const { title, description, imageUrl } = await req.json()
	if (!title || !description) return new NextResponse('Missing fields', { status: 400 })

	// Create placeholder card (unpaid)
	const card = await prisma.customCard.create({ data: {
		title,
		description,
		imageUrl,
		createdById: user.id,
		paymentStatus: 'unpaid'
	}})

	const checkout = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [
			{ price: process.env.STRIPE_PRICE_ID as string, quantity: 1 }
		],
		success_url: `${process.env.NEXTAUTH_URL}/create/success?card=${card.id}`,
		cancel_url: `${process.env.NEXTAUTH_URL}/create/cancel?card=${card.id}`,
		metadata: { cardId: card.id, userId: user.id }
	})

	await prisma.customCard.update({ where: { id: card.id }, data: { checkoutSessionId: checkout.id } })

	return NextResponse.json({ url: checkout.url })
}