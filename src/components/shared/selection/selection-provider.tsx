"use client"

import { createContext, useContext, useState } from "react"

type SelectionContextValue = {
  isSelecting: boolean
  selectedValues: Set<string>
  selectedCount: number
  hasSelection: boolean

  startSelection: () => void
  stopSelection: () => void
  toggle: (value: string) => void
  isSelected: (value: string) => boolean
}

const SelectionContext = createContext<SelectionContextValue | null>(null)

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set())

  const startSelection = () => setIsSelecting(true)
  const stopSelection = () => {
    setIsSelecting(false)
    setSelectedValues(new Set())
  }

  const toggle = (value: string) => {
    setSelectedValues((prev) => {
      const next = new Set(prev)

      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }

      return next
    })
  }
  const isSelected = (value: string) => selectedValues.has(value)

  const value: SelectionContextValue = {
    isSelecting,
    selectedValues: selectedValues,
    selectedCount: selectedValues.size,
    hasSelection: selectedValues.size > 0,

    startSelection,
    stopSelection: stopSelection,
    toggle,
    isSelected,
  }

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  )
}

export function useSelection() {
  const context = useContext(SelectionContext)
  if (!context) {
    throw new Error("useIdSelection must be used within IdSelectionProvider")
  }
  return context
}
