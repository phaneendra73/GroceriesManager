"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Minus,
  ShoppingCart,
  Package,
  Upload,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Item } from "@/types";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  item: Item;
  onAddToCart?: (item: Item, quantity: number) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  showActions?: boolean;
  isInCart?: boolean;
  quantity?: number;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveFromCart?: (itemId: string) => void;
  onImageUpload?: (itemId: string, fileUrl: string) => void;
}

export function ItemCard({
  item,
  onAddToCart,
  onEdit,
  onDelete,
  showActions = true,
  isInCart = false,
  quantity = 1,
  onUpdateQuantity,
  onRemoveFromCart,
}: ItemCardProps) {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item, currentQuantity);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setCurrentQuantity(newQuantity);
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const getCategoryColor = (color: string | null) => {
    if (!color) return "bg-gray-100 text-gray-800";
    return color;
  };

  return (
    <Card
      className={cn(
        "h-full flex flex-col transition-all duration-200 hover:shadow-lg",
        !item.available && "opacity-60"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold leading-tight">
              {item.name}
            </CardTitle>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
            {item.price && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-lg font-semibold text-green-600">
                  ₹{item.price.toFixed(2)}
                </span>
              </div>
            )}
          </div>
          {item.imageUrl && (
            <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="mb-3">
          <Badge
            variant="secondary"
            className={getCategoryColor(item.category?.color || null)}
          >
            {item.category?.name}
          </Badge>
          {!item.available && (
            <Badge variant="destructive" className="ml-2">
              Out of Stock
            </Badge>
          )}
        </div>

        {item.notes && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.notes}
          </p>
        )}

        <div className="mt-auto space-y-2">
          {isInCart ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(currentQuantity - 1)}
                disabled={currentQuantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={currentQuantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                className="w-16 text-center h-8"
                min={1}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(currentQuantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveFromCart?.(item.id)}
                className="ml-auto h-8 px-3"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(currentQuantity - 1)}
                  disabled={currentQuantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={currentQuantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="w-16 text-center h-8"
                  min={1}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(currentQuantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!item.available}
                className="h-8 px-3 flex-shrink-0"
                size="sm"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add
              </Button>
              {showActions && (
                <div className="flex items-center">
                  {/* Keep Add / primary actions visible. Put edit/delete in a compact dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {onEdit && (
                        <DropdownMenuItem onSelect={() => onEdit(item)}>
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem onSelect={() => onDelete(item)}>
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
