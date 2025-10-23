"use client"

import React, { useState, ReactNode } from "react"

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
  onValueChange?: (value: string) => void
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

const TabsContext = React.createContext<{
  activeValue: string
  setActiveValue: (value: string) => void
} | null>(null)

export function Tabs({ defaultValue, onValueChange, children, className }: TabsProps) {
  const [activeValue, setActiveValue] = useState(defaultValue)

  const handleChange = (newValue: string) => {
    setActiveValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={`inline-flex h-9 items-center justify-center rounded-lg bg-transparent p-1 text-muted-foreground gap-x-2 ${
        className || ""
      }`}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("TabsTrigger must be used within <Tabs>")

  const { activeValue, setActiveValue } = ctx
  const isActive = activeValue === value

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive ? "bg-background text-foreground shadow" : ""
      } ${className || ""}`}
      onClick={() => setActiveValue(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("TabsContent must be used within <Tabs>")

  const { activeValue } = ctx
  if (activeValue !== value) return null

  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        className || ""
      }`}
    >
      {children}
    </div>
  )
}
