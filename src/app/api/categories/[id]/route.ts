import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest, context: any) {
  try {
    // Next's generated types can surface params as a Promise in some setups.
    // Resolve safely whether params is a plain object or a Promise.
    const params = await Promise.resolve(context?.params || {})
    const id = params?.id
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    await db.category.delete({ where: { id } })
    return NextResponse.json({ message: 'Category deleted' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
