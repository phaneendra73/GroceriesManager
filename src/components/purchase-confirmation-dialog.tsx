'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { PurchaseItem } from '@/types'

interface PurchaseConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (quantity: number, price: number, totalAmount: number) => void
  purchaseItem: PurchaseItem | null
}

export function PurchaseConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  purchaseItem,
}: PurchaseConfirmationDialogProps) {
  const [quantity, setQuantity] = useState(purchaseItem?.quantity || 1)
  const [price, setPrice] = useState(purchaseItem?.item?.price || 0)

  const totalAmount = quantity * price

  const handleConfirm = () => {
    onConfirm(quantity, price, totalAmount)
    onClose()
  }

  if (!purchaseItem) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Confirm Purchase
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold">{purchaseItem.item?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {purchaseItem.item?.category?.name}
              </p>
            </div>
            {purchaseItem.item?.imageUrl && (
              <img
                src={purchaseItem.item.imageUrl}
                alt={purchaseItem.item.name}
                className="w-12 h-12 object-cover rounded"
              />
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Purchased</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                className="text-center"
              />
            </div>

            <div className="space-y-2">
        <Label htmlFor="price">Price per Unit (₹)</Label>
              <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground">₹</span>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  min={0}
                  step="0.01"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  ₹{totalAmount.toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            Confirm Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}