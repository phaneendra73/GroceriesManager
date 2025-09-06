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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const categoryId = searchParams.get('categoryId')
    const available = searchParams.get('available')

    const where: any = {}
    
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (available === 'true') {
      where.available = true
    } else if (available === 'false') {
      where.available = false
    }

    const items = await db.item.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = itemSchema.parse(body)

    const item = await db.item.create({
      data: {
        ...validatedData,
        imageUrl: validatedData.imageUrl || null,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zErr = error as z.ZodError
      return NextResponse.json(
        { error: 'Validation failed', details: zErr.issues },
        { status: 400 }
      )
    }
    
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}