export interface Category {
  id: string
  name: string
  description?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}

export interface Item {
  id: string
  name: string
  description?: string
  imageUrl?: string
  defaultQuantity: number
  price?: number
  notes?: string
  available: boolean
  categoryId: string
  createdAt: Date
  updatedAt: Date
  category?: Category
}

export interface Template {
  id: string
  name: string
  description?: string
  userId?: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
  items?: TemplateItem[]
}

export interface TemplateItem {
  id: string
  templateId: string
  itemId: string
  quantity: number
  notes?: string
  item?: Item
}

export interface PurchaseList {
  id: string
  name?: string
  userId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  items?: PurchaseItem[]
}

export interface PurchaseItem {
  id: string
  purchaseListId: string
  itemId: string
  quantity: number
  notes?: string
  isPurchased: boolean
  createdAt: Date
  updatedAt: Date
  item?: Item
}

export interface PurchaseHistory {
  id: string
  userId?: string
  itemId: string
  quantity: number
  price?: number
  totalAmount?: number
  notes?: string
  createdAt: Date
  item?: Item
}