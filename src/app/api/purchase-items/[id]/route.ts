import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const purchaseItemSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    const purchaseItem = await db.purchaseItem.findUnique({
      where: { id },
      include: {
        item: {
          include: {
            category: true,
          },
        },
        purchaseList: true,
      },
    })

    if (!purchaseItem) {
      return NextResponse.json(
        { error: 'Purchase item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(purchaseItem)
  } catch (error) {
    console.error('Error fetching purchase item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    const body = await request.json()
    const validatedData = purchaseItemSchema.parse(body)

    const purchaseItem = await db.purchaseItem.update({
      where: { id },
      data: validatedData,
      include: {
        item: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(purchaseItem)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zErr = error as z.ZodError
      return NextResponse.json(
        { error: 'Validation failed', details: zErr.issues },
        { status: 400 }
      )
    }
    
    console.error('Error updating purchase item:', error)
    return NextResponse.json(
      { error: 'Failed to update purchase item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    const purchaseItem = await db.purchaseItem.findUnique({
      where: { id },
      include: {
        item: true,
      },
    })

    if (!purchaseItem) {
      return NextResponse.json(
        { error: 'Purchase item not found' },
        { status: 404 }
      )
    }

    // Add to purchase history before deleting
    await db.purchaseHistory.create({
      data: {
        itemId: purchaseItem.itemId,
        quantity: purchaseItem.quantity,
        notes: purchaseItem.notes,
      },
    })

    await db.purchaseItem.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Purchase item removed successfully' })
  } catch (error) {
    console.error('Error deleting purchase item:', error)
    return NextResponse.json(
      { error: 'Failed to delete purchase item' },
      { status: 500 }
    )
  }
}