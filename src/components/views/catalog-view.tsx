'use client'

import { useState, useEffect } from 'react'
import { ItemCard } from '@/components/item-card'
import { SearchFilter } from '@/components/search-filter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/image-upload'
import { Plus, Search } from 'lucide-react'
import { Item, Category } from '@/types'

interface CatalogViewProps {
  categories: Category[]
  onAddToPurchaseList: (item: Item, quantity: number) => void
  onCategoriesChange: () => void
}

export function CatalogView({ 
  categories, 
  onAddToPurchaseList, 
  onCategoriesChange 
}: CatalogViewProps) {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  // availability filter removed per request
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    defaultQuantity: 1,
    notes: '',
    available: true,
    categoryId: '',
  })

  useEffect(() => {
    loadItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, searchQuery, selectedCategory])

  const loadItems = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory) params.append('categoryId', selectedCategory)
  // availability filter removed

      const response = await fetch(`/api/items?${params}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Failed to load items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = items

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.categoryId === selectedCategory)
    }

  // availability filter removed

    setFilteredItems(filtered)
  }

  const handleCreateItem = async () => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await loadItems()
        setIsCreateDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create item')
      }
    } catch (error) {
      console.error('Failed to create item:', error)
      alert('Failed to create item')
    }
  }

  const handleUpdateItem = async () => {
    if (!editingItem) return

    try {
      const response = await fetch(`/api/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await loadItems()
        setEditingItem(null)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update item')
      }
    } catch (error) {
      console.error('Failed to update item:', error)
      alert('Failed to update item')
    }
  }

  const handleDeleteItem = async (item: Item) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return

    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadItems()
      } else {
        alert('Failed to delete item')
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Failed to delete item')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      defaultQuantity: 1,
      notes: '',
      available: true,
      categoryId: '',
    })
  }

  const handleEditItem = (item: Item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      defaultQuantity: item.defaultQuantity,
      notes: item.notes || '',
      available: item.available,
      categoryId: item.categoryId,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Item Catalog</h1>
          <p className="text-muted-foreground">
            Browse and manage grocery items
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen || !!editingItem} onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false)
            setEditingItem(null)
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Item name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Item description"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Image</label>
                <ImageUpload
                  currentImage={formData.imageUrl}
                  onImageUpload={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Default Quantity</label>
                <Input
                  type="number"
                  value={formData.defaultQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultQuantity: parseInt(e.target.value) || 1 }))}
                  min={1}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                />
                <label htmlFor="available" className="text-sm font-medium">
                  Available
                </label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={editingItem ? handleUpdateItem : handleCreateItem}
                  disabled={!formData.name || !formData.categoryId}
                  className="flex-1"
                >
                  {editingItem ? 'Update' : 'Create'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    setEditingItem(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <SearchFilter
        onSearch={setSearchQuery}
        onCategoryFilter={setSelectedCategory}
        categories={categories}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading items...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onAddToCart={onAddToPurchaseList}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Item
          </Button>
        </div>
      )}
    </div>
  )
}