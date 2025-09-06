"use client"

import React from 'react'
import { ThemeProvider } from 'next-themes'

type Props = {
  children: React.ReactNode
}

export default function ThemeProviderWrapper({ children }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" themes={["light","dark","system"]}>
      {children}
    </ThemeProvider>
  )
}
