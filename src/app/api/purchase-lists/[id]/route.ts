import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const purchaseListSchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().default(true),
})

export async function GET(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    const purchaseList = await db.purchaseList.findUnique({
      where: { id },
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
    })

    if (!purchaseList) {
      return NextResponse.json(
        { error: 'Purchase list not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(purchaseList)
  } catch (error) {
    console.error('Error fetching purchase list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase list' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    const body = await request.json()
    const validatedData = purchaseListSchema.parse(body)

    const purchaseList = await db.purchaseList.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(purchaseList)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zErr = error as z.ZodError
      return NextResponse.json(
        { error: 'Validation failed', details: zErr.issues },
        { status: 400 }
      )
    }
    
    console.error('Error updating purchase list:', error)
    return NextResponse.json(
      { error: 'Failed to update purchase list' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    await db.purchaseList.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Purchase list deleted successfully' })
  } catch (error) {
    console.error('Error deleting purchase list:', error)
    return NextResponse.json(
      { error: 'Failed to delete purchase list' },
      { status: 500 }
    )
  }
}