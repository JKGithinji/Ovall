import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' })

export async function POST(req: NextRequest) {
	const buf = Buffer.from(await req.arrayBuffer())
	const sig = req.headers.get('stripe-signature')
	let event: Stripe.Event
	try {
		if (!sig) throw new Error('No signature')
		event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
	} catch (err) {
		return new NextResponse(`Webhook Error: ${(err as Error).message}`, { status: 400 })
	}

	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object as Stripe.Checkout.Session
			const cardId = session.metadata?.cardId
			if (cardId) {
				await prisma.customCard.update({ where: { id: cardId }, data: { paymentStatus: 'paid' } })
			}
			break
		}
		default:
			break
	}

	return NextResponse.json({ received: true })
}