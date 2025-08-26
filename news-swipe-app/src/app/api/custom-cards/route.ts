import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const customCards = await prisma.customCard.findMany({
      where: { 
        isActive: true,
        isPaid: true // Only show paid cards
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json(customCards)
  } catch (error) {
    console.error('Error fetching custom cards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch custom cards' },
      { status: 500 }
    )
  }
}