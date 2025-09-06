import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const addTemplateSchema = z.object({
  templateId: z.string().min(1, 'Template is required'),
})

export async function POST(request: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params || {})
  const id = params?.id
  try {
    const body = await request.json()
    const { templateId } = addTemplateSchema.parse(body)

    // Get template with items
    const template = await db.template.findUnique({
      where: { id: templateId },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

  // Add each template item to the purchase list
  const addedItems: any[] = []
    for (const templateItem of template.items) {
      // Check if item already exists in the purchase list
      const existingItem = await db.purchaseItem.findUnique({
        where: {
          purchaseListId_itemId: {
            purchaseListId: id,
            itemId: templateItem.itemId,
          },
        },
      })

      if (!existingItem) {
        const purchaseItem = await db.purchaseItem.create({
          data: {
            purchaseListId: id,
            itemId: templateItem.itemId,
            quantity: templateItem.quantity,
            notes: templateItem.notes,
          },
          include: {
            item: {
              include: {
                category: true,
              },
            },
          },
        })
        addedItems.push(purchaseItem)
      }
    }

    return NextResponse.json({
      message: `Added ${addedItems.length} items from template "${template.name}"`,
      addedItems,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zErr = error as z.ZodError
      return NextResponse.json(
        { error: 'Validation failed', details: zErr.issues },
        { status: 400 }
      )
    }
    
    console.error('Error adding template to purchase list:', error)
    return NextResponse.json(
      { error: 'Failed to add template to purchase list' },
      { status: 500 }
    )
  }
}