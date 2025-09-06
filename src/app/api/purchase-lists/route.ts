import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const purchaseListSchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().default(true),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    const where: any = {}
    
    if (isActive === 'true') {
      where.isActive = true
    } else if (isActive === 'false') {
      where.isActive = false
    }

    const purchaseLists = await db.purchaseList.findMany({
      where,
      include: {
        items: {
          include: {
            item: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(purchaseLists)
  } catch (error) {
    console.error('Error fetching purchase lists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase lists' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = purchaseListSchema.parse(body)

    const purchaseList = await db.purchaseList.create({
      data: validatedData,
    })

    return NextResponse.json(purchaseList, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zErr = error as z.ZodError
      return NextResponse.json(
        { error: 'Validation failed', details: zErr.issues },
        { status: 400 }
      )
    }
    
    console.error('Error creating purchase list:', error)
    return NextResponse.json(
      { error: 'Failed to create purchase list' },
      { status: 500 }
    )
  }
}