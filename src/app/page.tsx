'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { ItemCard } from '@/components/item-card'
// templates feature removed from UI
import { PurchaseListItem } from '@/components/purchase-list-item'
import { SearchFilter } from '@/components/search-filter'
import { ToastContainer } from '@/components/toast-container'
import { ImageUpload } from '@/components/image-upload'
import { PurchaseConfirmationDialog } from '@/components/purchase-confirmation-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Package, ShoppingCart, History, Settings, BarChart3 } from 'lucide-react'
import { Item, Category, PurchaseList, PurchaseItem, PurchaseHistory } from '@/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState('catalog')
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false)
  // templates removed
  const [purchaseList, setPurchaseList] = useState<PurchaseList | null>(null)
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([])
  const [isLoadingPurchaseItems, setIsLoadingPurchaseItems] = useState<boolean>(false)
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false)
  const [mostPurchased, setMostPurchased] = useState<any[]>([])
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  // availability filter removed per request
  
  // Toast states
  const [toasts, setToasts] = useState<Array<{
    id: string
    message: string
    type?: 'success' | 'error' | 'info'
    duration?: number
    onUndo?: () => void
  }>>([])
  
  // Dialog states
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  // templates dialog removed
  const [isImageUploadDialogOpen, setIsImageUploadDialogOpen] = useState(false)
  const [isPurchaseConfirmationOpen, setIsPurchaseConfirmationOpen] = useState(false)
  const [currentItemForImage, setCurrentItemForImage] = useState<Item | null>(null)
  const [currentPurchaseItem, setCurrentPurchaseItem] = useState<PurchaseItem | null>(null)
  
  // Form states
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    imageUrl: '',
    defaultQuantity: 1,
    price: 0,
    notes: '',
    available: true,
    categoryId: '',
  })
  
  const [isAddingItem, setIsAddingItem] = useState(false)

  // Initialize purchase list
  useEffect(() => {
  initializePurchaseList()
  fetchCategories()
  fetchItems()
  }, [])

  const initializePurchaseList = async () => {
    try {
      const response = await fetch('/api/purchase-lists?isActive=true')
      const lists = await response.json()
      
      if (lists.length > 0) {
        setPurchaseList(lists[0])
        fetchPurchaseItems(lists[0].id)
      } else {
        // Create a new purchase list
        const createResponse = await fetch('/api/purchase-lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'My Shopping List', isActive: true }),
        })
        const newList = await createResponse.json()
        setPurchaseList(newList)
      }
    } catch (error) {
      console.error('Error initializing purchase list:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true)
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const fetchItems = async () => {
    try {
      setIsLoadingItems(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory) params.append('categoryId', selectedCategory)
      
      const response = await fetch(`/api/items?${params}`)
      const data = await response.json()

      // Normalize API responses: API can return an array or a wrapper object.
      let itemsData: any[] = []
      if (Array.isArray(data)) {
        itemsData = data
      } else if (data && Array.isArray((data as any).items)) {
        itemsData = (data as any).items
      } else if (data && Array.isArray((data as any).data)) {
        itemsData = (data as any).data
      } else if (data && Array.isArray((data as any).results)) {
        itemsData = (data as any).results
      } else {
        console.warn('fetchItems: unexpected response shape, expected array but got', data)
      }

      setItems(itemsData)
    } catch (error) {
      console.error('Error fetching items:', error)
    }
    finally {
      setIsLoadingItems(false)
    }
  }

  // templates removed

  const fetchPurchaseItems = async (listId: string) => {
    try {
      setIsLoadingPurchaseItems(true)
      const response = await fetch(`/api/purchase-lists/${listId}/items`)
      const data = await response.json()
      setPurchaseItems(data)
    } catch (error) {
      console.error('Error fetching purchase items:', error)
    } finally {
      setIsLoadingPurchaseItems(false)
    }
  }

  const fetchPurchaseHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const response = await fetch('/api/purchase-history')
      const data = await response.json()

      // normalize shapes: API may return { history, mostPurchased } or an array
      if (Array.isArray(data)) {
        setPurchaseHistory(data)
        setMostPurchased([])
      } else {
        setPurchaseHistory(Array.isArray(data.history) ? data.history : [])
        setMostPurchased(Array.isArray(data.mostPurchased) ? data.mostPurchased : [])
      }
    } catch (error) {
      console.error('Error fetching purchase history:', error)
      setPurchaseHistory([])
      setMostPurchased([])
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success', onUndo?: () => void) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type, onUndo }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const handleAddItem = async () => {
    if (isAddingItem) return
    setIsAddingItem(true)
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })

      if (response.ok) {
        await fetchItems()
        setIsAddItemDialogOpen(false)
        setNewItem({
          name: '',
          description: '',
          imageUrl: '',
          defaultQuantity: 1,
          price: 0,
          notes: '',
          available: true,
          categoryId: '',
        })
        addToast('Item added successfully!')
      } else {
        const error = await response.json()
        addToast(error.error || 'Failed to add item', 'error')
      }
    } catch (error) {
      addToast('Failed to add item', 'error')
    } finally {
      setIsAddingItem(false)
    }
  }

  const handleUpdateItem = async () => {
    if (isAddingItem) return
    if (!editingItemId) return
    setIsAddingItem(true)
    try {
      const response = await fetch(`/api/items/${editingItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })

      if (response.ok) {
        await fetchItems()
        setIsAddItemDialogOpen(false)
        setEditingItemId('')
        setNewItem({
          name: '',
          description: '',
          imageUrl: '',
          defaultQuantity: 1,
          price: 0,
          notes: '',
          available: true,
          categoryId: '',
        })
        addToast('Item updated successfully!')
      } else {
        const error = await response.json()
        addToast(error.error || 'Failed to update item', 'error')
      }
    } catch (error) {
      addToast('Failed to update item', 'error')
    } finally {
      setIsAddingItem(false)
    }
  }

  const handleImageUpload = async (item: Item) => {
    setCurrentItemForImage(item)
    setIsImageUploadDialogOpen(true)
  }

  // Open full edit dialog for an item
  const handleEditItem = (item: Item) => {
    // Populate the add/edit form with item data and open the dialog
    setNewItem({
      name: item.name,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      defaultQuantity: item.defaultQuantity || 1,
      price: item.price || 0,
      notes: item.notes || '',
      available: item.available,
      categoryId: item.categoryId || '',
    })
    setIsAddItemDialogOpen(true)
    // mark that this is an edit by storing id on a ref-like state
    setEditingItemId(item.id)
  }

  const handleImageUploaded = async (imageUrl: string) => {
    if (!currentItemForImage) return
    
    try {
      const response = await fetch(`/api/items/${currentItemForImage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...currentItemForImage,
          imageUrl 
        }),
      })
      
      if (response.ok) {
        await fetchItems()
        setIsImageUploadDialogOpen(false)
        setCurrentItemForImage(null)
        addToast('Image uploaded successfully!')
      } else {
        const error = await response.json()
        addToast(error.error || 'Failed to update item image', 'error')
      }
    } catch (error) {
      addToast('Failed to update item image', 'error')
    }
  }

  const handleRemoveFromCart = async (purchaseItem: PurchaseItem) => {
    setCurrentPurchaseItem(purchaseItem)
    setIsPurchaseConfirmationOpen(true)
  }

  const handleConfirmPurchase = async (quantity: number, price: number, totalAmount: number) => {
    if (!currentPurchaseItem || !purchaseList) return
    
    try {
      // Add to purchase history with price and total amount
      await fetch('/api/purchase-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: currentPurchaseItem.itemId,
          quantity,
          price,
          totalAmount,
          notes: currentPurchaseItem.notes,
        }),
      })

      // Remove from purchase list
      await fetch(`/api/purchase-items/${currentPurchaseItem.id}`, {
        method: 'DELETE',
      })

      await fetchPurchaseItems(purchaseList.id)
      addToast(
        `Purchased ${quantity} ${currentPurchaseItem.item?.name} for ₹${totalAmount.toFixed(2)}!`,
        'success',
        async () => {
          // Undo: add back to purchase list and remove from history
          if (purchaseList) {
            await fetch(`/api/purchase-lists/${purchaseList.id}/items`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                itemId: currentPurchaseItem.itemId, 
                quantity: currentPurchaseItem.quantity,
                notes: currentPurchaseItem.notes,
              }),
            })
            await fetchPurchaseItems(purchaseList.id)
          }
        }
      )
    } catch (error) {
      addToast('Failed to complete purchase', 'error')
    }
  }

  const handleDeleteFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`/api/purchase-items/${itemId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        if (purchaseList) {
          await fetchPurchaseItems(purchaseList.id)
        }
        addToast('Item removed from cart')
      } else {
        addToast('Failed to remove item', 'error')
      }
    } catch (error) {
      addToast('Failed to remove item', 'error')
    }
  }

  // templates removed

  // Category management (add / delete)
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '' })
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  const handleAddCategory = async () => {
    if (isAddingCategory) return
    setIsAddingCategory(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      })

      if (response.ok) {
        await fetchCategories()
        setNewCategory({ name: '', description: '', color: '' })
        addToast('Category added')
      } else {
        const err = await response.json()
        addToast(err.error || 'Failed to add category', 'error')
      }
    } catch (error) {
      addToast('Failed to add category', 'error')
    } finally {
      setIsAddingCategory(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchCategories()
        addToast('Category deleted')
      } else {
        addToast('Failed to delete category', 'error')
      }
    } catch (error) {
      addToast('Failed to delete category', 'error')
    }
  }

  const [isClearingHistory, setIsClearingHistory] = useState(false)
  const handleClearHistory = async () => {
    if (isClearingHistory) return
    setIsClearingHistory(true)
    try {
      const response = await fetch('/api/purchase-history', { method: 'DELETE' })
      if (response.ok) {
        await fetchPurchaseHistory()
        addToast('Purchase history cleared')
      } else {
        addToast('Failed to clear history', 'error')
      }
    } catch (error) {
      addToast('Failed to clear history', 'error')
    } finally {
      setIsClearingHistory(false)
    }
  }

  // small state to track edit id
  const [editingItemId, setEditingItemId] = useState<string>('')

  const handleAddToCart = async (item: Item, quantity: number) => {
    if (!purchaseList) return
    try {
      const response = await fetch(`/api/purchase-lists/${purchaseList.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, quantity }),
      })

      if (response.ok) {
        await fetchPurchaseItems(purchaseList.id)
        addToast(`${item.name} added to cart!`)
      } else {
        const error = await response.json()
        addToast(error.error || 'Failed to add item to cart', 'error')
      }
    } catch (error) {
      addToast('Failed to add item to cart', 'error')
    }
  }
  // templates removed

  const handleDeleteItem = async (item: Item) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return
    try {
      const response = await fetch(`/api/items/${item.id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchItems()
        addToast('Item deleted')
      } else {
        addToast('Failed to delete item', 'error')
      }
    } catch (error) {
      addToast('Failed to delete item', 'error')
    }
  }

  const handleTogglePurchased = async (itemId: string, isPurchased: boolean) => {
    if (!purchaseList) return
    
    try {
      const item = purchaseItems.find(pi => pi.id === itemId)
      if (!item) return
      
      if (isPurchased) {
        // Open purchase confirmation dialog
        handleRemoveFromCart(item)
      }
      
      await fetchPurchaseItems(purchaseList.id)
    } catch (error) {
      addToast('Failed to update item', 'error')
    }
  }

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/purchase-items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      
      if (response.ok) {
        if (purchaseList) {
          await fetchPurchaseItems(purchaseList.id)
        }
      } else {
        addToast('Failed to update quantity', 'error')
      }
    } catch (error) {
      addToast('Failed to update quantity', 'error')
    }
  }

      // Update items when filters change
  useEffect(() => {
    fetchItems()
  }, [searchQuery, selectedCategory])

  // Update purchase history when tab changes
  useEffect(() => {
    if (activeTab === 'history') {
      fetchPurchaseHistory()
    }
  }, [activeTab])

  const getActiveItems = () => {
  if (!Array.isArray(items)) return []
  return items.filter(item => item.available)
  }

  const getUnavailableItems = () => {
  if (!Array.isArray(items)) return []
  return items.filter(item => !item.available)
  }

  const getActivePurchaseItems = () => {
  if (!Array.isArray(purchaseItems)) return []
  return purchaseItems.filter(item => !item.isPurchased)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        purchaseItemCount={getActivePurchaseItems().length}
      />
      
      <main className="lg:ml-64 p-6 pt-16 lg:pt-6">
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Item Catalog</h1>
              <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                      <DialogTitle>{editingItemId ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                    </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Item name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Item description"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={newItem.categoryId}
                        onValueChange={(value) => setNewItem({ ...newItem, categoryId: value })}
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
                        value={newItem.defaultQuantity}
                        onChange={(e) => setNewItem({ ...newItem, defaultQuantity: parseInt(e.target.value) || 1 })}
                        min={1}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price (₹)</label>
                      <Input
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Image URL</label>
                      <Input
                        value={newItem.imageUrl}
                        onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea
                        value={newItem.notes}
                        onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                        placeholder="Additional notes"
                      />
                    </div>
                    <Button
                      onClick={editingItemId ? handleUpdateItem : handleAddItem}
                      className="w-full"
                      disabled={isAddingItem}
                    >
                      {isAddingItem ? (editingItemId ? 'Updating…' : 'Adding…') : (editingItemId ? 'Update Item' : 'Add Item')}
                    </Button>
                    <div className="pt-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsAddItemDialogOpen(false)
                          setEditingItemId('')
                          setNewItem({
                            name: '',
                            description: '',
                            imageUrl: '',
                            defaultQuantity: 1,
                            price: 0,
                            notes: '',
                            available: true,
                            categoryId: '',
                          })
                        }}
                        className="w-full"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoadingItems ? (
                // show 6 skeleton cards while loading
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-4 bg-card rounded-md">
                    <Skeleton className="h-32 mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))
              ) : (
                getActiveItems().map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                ))
              )}
            </div>
            
            {/* Out of Stock section removed per request */}
          </div>
        )}
        
  {/* templates removed */}
        
        {activeTab === 'purchase-list' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Shopping List</h1>
            
            {getActivePurchaseItems().length === 0 ? (
              isLoadingPurchaseItems ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-48" />
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your shopping list is empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Add items from the catalog or use a template to get started.
                    </p>
                    <Button onClick={() => setActiveTab('catalog')}>
                      Browse Catalog
                    </Button>
                  </CardContent>
                </Card>
              )
            ) : (
              <div className="space-y-4">
                {getActivePurchaseItems().map((purchaseItem) => (
                  <PurchaseListItem
                    key={purchaseItem.id}
                    purchaseItem={purchaseItem}
                    onTogglePurchased={handleTogglePurchased}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleDeleteFromCart}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Purchase History</h1>
            
            <Tabs defaultValue="recent" className="w-full">
              <TabsList>
                <TabsTrigger value="recent">Recent Purchases</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-4">
                {purchaseHistory.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No purchase history</h3>
                      <p className="text-muted-foreground">
                        Your purchase history will appear here after you mark items as purchased.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {purchaseHistory.map((history) => (
                      <Card key={history.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{history.item?.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {history.quantity} {history.quantity === 1 ? 'item' : 'items'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(history.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {history.item?.category?.name}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Most Purchased Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                            {isLoadingHistory ? (
                              <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div key={i} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <Skeleton className="h-6 w-6" />
                                      <Skeleton className="h-4 w-32" />
                                    </div>
                                    <div className="text-right">
                                      <Skeleton className="h-4 w-12" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {mostPurchased.slice(0, 10).map((item, index) => (
                                  <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="w-8 h-8 flex items-center justify-center text-xs">
                                        {index + 1}
                                      </Badge>
                                      <span className="font-medium">{item.name}</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold">{item.totalQuantity}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {item.purchaseCount} purchases
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Shopping Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Purchases</span>
                          <Badge variant="secondary">{purchaseHistory.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Unique Items</span>
                          <Badge variant="secondary">{mostPurchased.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Items Purchased</span>
                          <Badge variant="secondary">
                            {mostPurchased.reduce((sum, item) => sum + (item.totalQuantity || 0), 0)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground">
                      Grocery Manager is a simple application to manage your shopping lists and grocery items.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Features</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Browse and manage grocery items</li>
                      <li>Create and use shopping templates</li>
                      <li>Track your purchase history</li>
                      <li>View analytics and statistics</li>
                      <li>Search and filter items</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Database</h3>
                    <p className="text-muted-foreground">
                      This application uses SQLite for data storage. All data is stored locally.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Categories</h3>
                    <p className="text-muted-foreground mb-2">Add or remove categories used by items.</p>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                      />
                      <Button onClick={handleAddCategory} disabled={isAddingCategory}>
                        {isAddingCategory ? 'Adding…' : 'Add'}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{cat.name}</div>
                            {cat.description && <div className="text-sm text-muted-foreground">{cat.description}</div>}
                          </div>
                          <Button variant="ghost" onClick={() => handleDeleteCategory(cat.id)}>
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Purchase History</h3>
                    <p className="text-muted-foreground mb-2">Clear your purchase history.</p>
                    <Button onClick={handleClearHistory} disabled={isClearingHistory}>
                      {isClearingHistory ? 'Clearing…' : 'Clear Purchase History'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Image Upload Dialog */}
        <Dialog open={isImageUploadDialogOpen} onOpenChange={setIsImageUploadDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Item Image</DialogTitle>
            </DialogHeader>
            {currentItemForImage && (
              <ImageUpload
                onImageUpload={handleImageUploaded}
                currentImage={currentItemForImage.imageUrl}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Purchase Confirmation Dialog */}
        <PurchaseConfirmationDialog
          isOpen={isPurchaseConfirmationOpen}
          onClose={() => setIsPurchaseConfirmationOpen(false)}
          onConfirm={handleConfirmPurchase}
          purchaseItem={currentPurchaseItem}
        />
      </main>
      
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}