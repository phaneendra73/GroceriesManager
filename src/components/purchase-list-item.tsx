'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Plus, Minus, Trash2, Undo } from 'lucide-react'
import { PurchaseItem, Item } from '@/types'

interface PurchaseListItemProps {
  purchaseItem: PurchaseItem
  onTogglePurchased: (itemId: string, isPurchased: boolean) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
  onUndo?: (itemId: string) => void
  showUndo?: boolean
}

export function PurchaseListItem({
  purchaseItem,
  onTogglePurchased,
  onUpdateQuantity,
  onRemove,
  onUndo,
  showUndo = false,
}: PurchaseListItemProps) {
  const { item, quantity, isPurchased, id } = purchaseItem

  if (!item) return null

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    onUpdateQuantity(id, newQuantity)
  }

  const getCategoryColor = (color: string | null) => {
    if (!color) return 'bg-gray-100 text-gray-800'
    return color
  }

  return (
    <Card className={`${isPurchased ? 'opacity-60 bg-gray-50' : ''} ${showUndo ? 'border-green-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center h-6 mt-1">
            <Checkbox
              checked={isPurchased}
              onCheckedChange={(checked) => onTogglePurchased(id, checked as boolean)}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-medium ${isPurchased ? 'line-through text-muted-foreground' : ''}`}>
                    {item.name}
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className={getCategoryColor(item.category?.color || null)}
                  >
                    {item.category?.name}
                  </Badge>
                  {!item.available && (
                    <Badge variant="destructive" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.description}
                  </p>
                )}
                
                {item.notes && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Notes: {item.notes}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isPurchased}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center"
                    min={1}
                    disabled={isPurchased}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={isPurchased}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm text-muted-foreground ml-2">
                    {quantity} {quantity === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {item.imageUrl && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex gap-1">
                  {showUndo && onUndo && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUndo(id)}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <Undo className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}