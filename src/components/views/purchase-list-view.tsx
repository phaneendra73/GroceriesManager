'use client'

import { PurchaseListItem } from '@/components/purchase-list-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, RefreshCw, Package } from 'lucide-react'
import { PurchaseItem } from '@/types'

interface PurchaseListViewProps {
  purchaseItems: PurchaseItem[]
  onTogglePurchased: (itemId: string, isPurchased: boolean) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
  onRefresh: () => void
}

export function PurchaseListView({
  purchaseItems,
  onTogglePurchased,
  onUpdateQuantity,
  onRemove,
  onRefresh,
}: PurchaseListViewProps) {
  const availableItems = purchaseItems.filter(item => item.item?.available !== false)
  const unavailableItems = purchaseItems.filter(item => item.item?.available === false)

  const totalItems = purchaseItems.reduce((sum, item) => sum + item.quantity, 0)
  const availableItemCount = availableItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Shopping List</h1>
          <p className="text-muted-foreground">
            Manage your current shopping list
          </p>
        </div>
        
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{availableItemCount}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{totalItems - availableItemCount}</p>
              </div>
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shopping List Items */}
      <div className="space-y-4">
        {availableItems.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              Available Items
              <Badge variant="secondary">{availableItems.length}</Badge>
            </h2>
            <div className="space-y-3">
              {availableItems.map((item) => (
                <PurchaseListItem
                  key={item.id}
                  purchaseItem={item}
                  onTogglePurchased={onTogglePurchased}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </div>
        )}

        {unavailableItems.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              Out of Stock
              <Badge variant="destructive">{unavailableItems.length}</Badge>
            </h2>
            <div className="space-y-3">
              {unavailableItems.map((item) => (
                <PurchaseListItem
                  key={item.id}
                  purchaseItem={item}
                  onTogglePurchased={onTogglePurchased}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </div>
        )}

        {purchaseItems.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Your shopping list is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add items from the catalog or use a template to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}