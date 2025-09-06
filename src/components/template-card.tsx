'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Package, Users } from 'lucide-react'
import { Template } from '@/types'

interface TemplateCardProps {
  template: Template
  onUseTemplate?: (template: Template) => void
  onEdit?: (template: Template) => void
  onDelete?: (template: Template) => void
  showActions?: boolean
}

export function TemplateCard({
  template,
  onUseTemplate,
  onEdit,
  onDelete,
  showActions = true,
}: TemplateCardProps) {
  const handleUseTemplate = () => {
    if (onUseTemplate) {
      onUseTemplate(template)
    }
  }

  const itemCount = template.items?.length || 0

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {template.name}
              {template.isDefault && (
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Default
                </Badge>
              )}
            </CardTitle>
            {template.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{itemCount} items</span>
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <Button
            onClick={handleUseTemplate}
            className="w-full"
            disabled={itemCount === 0}
          >
            <Copy className="h-4 w-4 mr-2" />
            Use Template
          </Button>

          {showActions && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(template)}
                  className="flex-1"
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(template)}
                  className="flex-1"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}