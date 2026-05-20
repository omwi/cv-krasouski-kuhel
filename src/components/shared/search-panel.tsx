"use client"

import { Search } from "lucide-react"
import { useT } from "next-i18next/client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useDebouncedInput } from "@/hooks/use-debounce-input"
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
  const { t } = useT("user-table")

  const [localValue, setLocalValue] = useDebouncedInput({
    externalValue: value,
    onChangeAction,
    debounceMs,
  })

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
