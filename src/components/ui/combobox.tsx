"use client"

import { KeyboardEvent, MouseEvent, useId, useState } from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { useT } from "next-i18next/client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FloatingLabel } from "@/components/ui/floating-label"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type ComboboxOption = {
  value: string
  label: string
}

type BaseComboboxProps = {
  id?: string
  label: string
  options: ComboboxOption[]
  disabled?: boolean
  searchPlaceholder?: string
  emptyText?: string
}

export type SingleComboboxProps = BaseComboboxProps & {
  mode: "single"
  value: string
  onValueChange: (val: string) => void
}

export type MultiComboboxProps = BaseComboboxProps & {
  mode?: "multi"
  value: string[]
  onValueChange: (val: string[]) => void
}

export type ComboboxProps = SingleComboboxProps | MultiComboboxProps

export function Combobox(props: ComboboxProps) {
  const { t } = useT("common")

  const {
    id,
    label,
    options = [],
    disabled,
    searchPlaceholder = t("search-placeholder"),
    emptyText = t("no-options"),
    mode = "multi",
  } = props

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const generatedId = useId()
  const comboboxId = id || generatedId

  const isMulti = mode === "multi"

  const isEmpty = isMulti
    ? !props.value || (props.value as string[]).length === 0
    : !props.value

  const handleSelect = (optionValue: string) => {
    if (isMulti) {
      const currentValues = (props.value as string[]) || []
      if (currentValues.includes(optionValue)) {
        ;(props.onValueChange as (val: string[]) => void)(
          currentValues.filter((v) => v !== optionValue)
        )
      } else {
        ;(props.onValueChange as (val: string[]) => void)([
          ...currentValues,
          optionValue,
        ])
      }
    } else {
      const currentValue = props.value as string
      if (currentValue === optionValue) {
        ;(props.onValueChange as (val: string) => void)("")
      } else {
        ;(props.onValueChange as (val: string) => void)(optionValue)
      }
      setOpen(false)
    }
  }

  const handleRemove = (
    e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
    optionValue: string
  ) => {
    e.stopPropagation()
    e.preventDefault()
    if (isMulti) {
      const currentValues = (props.value as string[]) || []
      ;(props.onValueChange as (val: string[]) => void)(
        currentValues.filter((v) => v !== optionValue)
      )
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearch("")
    }
  }

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={handleOpenChange} modal={true}>
        <PopoverTrigger asChild>
          <Button
            id={comboboxId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "peer h-auto min-h-12 w-full justify-between rounded-none px-3 py-1 text-left text-base font-normal",
              "hover:bg-transparent focus:bg-transparent active:bg-transparent aria-expanded:bg-transparent",
              "hover:border-foreground focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:border-primary",
              isEmpty && "text-muted-foreground"
            )}
            disabled={disabled}
            data-empty={isEmpty}
          >
            <div className="flex flex-wrap items-center gap-1">
              {isEmpty ? (
                <span className="opacity-0">{label}</span>
              ) : isMulti ? (
                (props.value as string[]).map((val) => {
                  const optionLabel =
                    options.find((o) => o.value === val)?.label || val
                  return (
                    <Badge key={val} className="my-1 mr-1">
                      {optionLabel}
                      <div
                        role="button"
                        className="ml-1 rounded-full ring-offset-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRemove(e, val)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => handleRemove(e, val)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </div>
                    </Badge>
                  )
                })
              ) : (
                <span className="text-base text-foreground">
                  {options.find((o) => o.value === props.value)?.label ||
                    (props.value as string)}
                </span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] rounded-none p-0"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-11 w-full border-0 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted-foreground hover:border-0 focus-visible:border-0 focus-visible:ring-0"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto overscroll-contain p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = isMulti
                  ? ((props.value as string[]) || []).includes(option.value)
                  : (props.value as string) === option.value
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
      <FloatingLabel
        htmlFor={comboboxId}
        className={cn(
          "peer-data-[empty=true]:top-1/2 peer-data-[empty=true]:-translate-y-1/2 peer-data-[empty=true]:scale-100",
          "peer-data-[state=open]:top-2 peer-data-[state=open]:-translate-y-4 peer-data-[state=open]:scale-75 peer-data-[state=open]:px-2 peer-data-[state=open]:text-primary"
        )}
      >
        {label}
      </FloatingLabel>
    </div>
  )
}
