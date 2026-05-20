"use client"

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import { useT } from "next-i18next/client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

type SearchPanelProps = {
  className?: string
  debounceMs?: number
  onChangeAction: (value: string) => void
  value: string
}

export default function SearchPanel({
  value,
  onChangeAction,
  debounceMs = 300,
  className,
}: SearchPanelProps) {
  const [prevValue, setPrevValue] = useState(value)
  const [localValue, setLocalValue] = useState(value)
  const { t } = useT("user-table")

  if (value !== prevValue) {
    setPrevValue(value)
    setLocalValue(value)
  }

  const onChangeRef = useRef(onChangeAction)
  useEffect(() => {
    onChangeRef.current = onChangeAction
  })

  const valueRef = useRef(value)
  useEffect(() => {
    valueRef.current = value
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== valueRef.current) {
        onChangeRef.current(localValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, debounceMs])

  return (
    <div className={cn(className)}>
      <InputGroup>
        <InputGroupInput
          type="search"
          placeholder={t("search-placeholder")}
          className="w-full"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        />
        <InputGroupAddon align="inline-start">
          <Search className="h-4 w-4 text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
