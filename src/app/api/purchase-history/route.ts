import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const [history, total] = await Promise.all([
      db.purchaseHistory.findMany({
        include: {
          item: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      db.purchaseHistory.count(),
    ])

    // Get most purchased items
    const mostPurchased = await db.purchaseHistory.groupBy({
      by: ['itemId'],
      _sum: {
        quantity: true,
      },
      _count: {
        itemId: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    })

    const mostPurchasedItems = await Promise.all(
      mostPurchased.map(async (item) => {
        const itemDetails = await db.item.findUnique({
          where: { id: item.itemId },
          include: {
            category: true,
          },
        })
        return {
          ...itemDetails,
          totalQuantity: item._sum.quantity,
          purchaseCount: item._count.itemId,
        }
      })
    )

    return NextResponse.json({
      history,
      total,
      mostPurchased: mostPurchasedItems,
    })
  } catch (error) {
    console.error('Error fetching purchase history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase history' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await db.purchaseHistory.deleteMany({})
    return NextResponse.json({ message: 'Purchase history cleared' })
  } catch (error) {
    console.error('Error clearing purchase history:', error)
    return NextResponse.json({ error: 'Failed to clear purchase history' }, { status: 500 })
  }
}