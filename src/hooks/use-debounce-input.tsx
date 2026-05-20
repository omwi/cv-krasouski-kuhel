import { useEffect, useRef, useState } from "react"

type UseDebouncedInputProps = {
  externalValue: string
  onChangeAction: (value: string) => void
  debounceMs: number
}

export function useDebouncedInput({
  externalValue,
  onChangeAction,
  debounceMs,
}: UseDebouncedInputProps) {
  const [prevExternalValue, setPrevExternalValue] = useState(externalValue)
  const [localValue, setLocalValue] = useState(externalValue)

  const onChangeRef = useRef(onChangeAction)

  useEffect(() => {
    onChangeRef.current = onChangeAction
  }, [onChangeAction])

  if (externalValue !== prevExternalValue) {
    setPrevExternalValue(externalValue)
    setLocalValue(externalValue)
  }

  useEffect(() => {
    if (localValue === externalValue) return

    const timer = setTimeout(() => {
      onChangeRef.current(localValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, debounceMs, externalValue])

  return [localValue, setLocalValue] as const
}
