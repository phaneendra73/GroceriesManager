"use client"

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Zap } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const current = theme === 'system' ? resolvedTheme : theme

  const nextTheme = () => {
    if (current === 'light') return setTheme('dark')
    if (current === 'dark') return setTheme('system')
    return setTheme('light')
  }

  return (
    <Button variant="ghost" size="sm" onClick={nextTheme} className="absolute right-4 top-4 z-50">
      {current === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}
