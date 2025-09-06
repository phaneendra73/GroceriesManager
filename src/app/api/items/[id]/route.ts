import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  defaultQuantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  notes: z.string().optional(),
  available: z.boolean().default(true),
  categoryId: z.string().min(1, 'Category is required'),
})

export async function GET(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    const item = await db.item.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

  if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    const body = await request.json()
    const validatedData = itemSchema.parse(body)

    const item = await db.item.update({
      where: { id },
      data: {
        ...validatedData,
        imageUrl: validatedData.imageUrl || null,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zErr = error as z.ZodError
      return NextResponse.json(
        { error: 'Validation failed', details: zErr.issues },
        { status: 400 }
      )
    }
    
    console.error('Error updating item:', error)
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    await db.item.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}