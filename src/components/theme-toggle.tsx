'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Laptop } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const options = [
  { id: 'system', icon: Laptop, label: 'System' },
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'dark', icon: Moon, label: 'Dark' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Prevent SSR mismatch: render nothing until mounted
    return (
      <fieldset className="flex items-center justify-center rounded-md border p-1">
        <legend className="sr-only">Select a display theme:</legend>
        {options.map(({ id, icon: Icon, label }) => (
          <label
            key={id}
            className="flex h-8 w-8 items-center justify-center rounded-3xl bg-muted"
          >
            <span className="sr-only">{label}</span>
            <Icon className="h-4 w-4 opacity-50" />
          </label>
        ))}
      </fieldset>
    )
  }

  return (
    <fieldset className="flex items-center justify-center rounded-4xl border min-w-1.5">
      <legend className="sr-only">Select a display theme:</legend>
      {options.map(({ id, icon: Icon, label }) => {
        const isActive = theme === id
        return (
          <label
            key={id}
            className={cn(
              'flex h-8 w-8 cursor-pointer items-center justify-center rounded-3xl transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground'
            )}
          >
            <input
              type="radio"
              value={id}
              checked={isActive}
              onChange={() => setTheme(id)}
              className="sr-only"
              aria-label={label}
            />
            <Icon className="h-4 w-4" />
          </label>
        )
      })}
    </fieldset>
  )
}
