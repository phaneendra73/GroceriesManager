import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const purchaseItemSchema = z.object({
  itemId: z.string().min(1, 'Item is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    const purchaseItems = await db.purchaseItem.findMany({
      where: { purchaseListId: id },
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
    })

    return NextResponse.json(purchaseItems)
  } catch (error) {
    console.error('Error fetching purchase items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    const body = await request.json()
    const validatedData = purchaseItemSchema.parse(body)

    // Check if item already exists in the purchase list
    const existingItem = await db.purchaseItem.findUnique({
      where: {
        purchaseListId_itemId: {
          purchaseListId: id,
          itemId: validatedData.itemId,
        },
      },
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already exists in purchase list' },
        { status: 400 }
      )
    }

    const purchaseItem = await db.purchaseItem.create({
      data: {
        ...validatedData,
        purchaseListId: id,
      },
      include: {
        item: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(purchaseItem, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zErr = error as z.ZodError
      return NextResponse.json(
        { error: 'Validation failed', details: zErr.issues },
        { status: 400 }
      )
    }
    
    console.error('Error adding item to purchase list:', error)
    return NextResponse.json(
      { error: 'Failed to add item to purchase list' },
      { status: 500 }
    )
  }
}