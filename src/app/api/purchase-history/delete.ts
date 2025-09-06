import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// NOTE: This endpoint deletes all purchase history records. Use with caution.
export async function DELETE() {
  try {
    await db.purchaseHistory.deleteMany({})
    return NextResponse.json({ message: 'Purchase history cleared' })
  } catch (error) {
    console.error('Error clearing purchase history:', error)
    return NextResponse.json({ error: 'Failed to clear purchase history' }, { status: 500 })
  }
}
