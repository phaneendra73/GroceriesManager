'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'
import { Category } from '@/types'

interface SearchFilterProps {
  onSearch: (query: string) => void
  onCategoryFilter: (categoryId: string | null) => void
  categories: Category[]
  selectedCategory?: string | null
  searchQuery?: string
}

export function SearchFilter({
  onSearch,
  onCategoryFilter,
  categories,
  selectedCategory = null,
  searchQuery = '',
}: SearchFilterProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value)
    onSearch(value)
  }

  const clearFilters = () => {
    setLocalSearchQuery('')
    onSearch('')
    onCategoryFilter(null)
  }

  const hasActiveFilters = Boolean(localSearchQuery || selectedCategory)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search items..."
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <Select
          value={selectedCategory || 'all'}
          onValueChange={(value) => onCategoryFilter(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

  {/* Availability filter removed per design request */}
      </div>

      {hasActiveFilters && (
        <div className="flex gap-2 flex-wrap">
          {localSearchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {localSearchQuery}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleSearchChange('')}
              />
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              Category: {categories.find(c => c.id === selectedCategory)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onCategoryFilter(null)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}