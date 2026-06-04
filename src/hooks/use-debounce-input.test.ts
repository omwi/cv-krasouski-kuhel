import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useDebouncedInput } from "@/hooks/use-debounce-input"

describe("useDebouncedInput", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it("should initialize local value from externalValue", () => {
    const { result } = renderHook(() =>
      useDebouncedInput({
        externalValue: "initial",
        onChangeAction: vi.fn(),
        debounceMs: 300,
      })
    )

    expect(result.current[0]).toBe("initial")
  })

  it("should debounce onChangeAction when local value changes", () => {
    const onChangeAction = vi.fn()

    const { result } = renderHook(() =>
      useDebouncedInput({
        externalValue: "",
        onChangeAction,
        debounceMs: 300,
      })
    )

    act(() => {
      result.current[1]("hello")
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(onChangeAction).toHaveBeenCalledTimes(1)
    expect(onChangeAction).toHaveBeenCalledWith("hello")
  })

  it("should not call onChangeAction before debounce duration elapses", () => {
    const onChangeAction = vi.fn()

    const { result } = renderHook(() =>
      useDebouncedInput({
        externalValue: "",
        onChangeAction,
        debounceMs: 300,
      })
    )

    act(() => {
      result.current[1]("hello")
    })

    act(() => {
      vi.advanceTimersByTime(299)
    })

    expect(onChangeAction).not.toHaveBeenCalled()
  })

  it("should only invoke onChangeAction once with the latest value after multiple rapid updates", () => {
    const onChangeAction = vi.fn()

    const { result } = renderHook(() =>
      useDebouncedInput({
        externalValue: "",
        onChangeAction,
        debounceMs: 300,
      })
    )

    act(() => {
      result.current[1]("h")
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    act(() => {
      result.current[1]("he")
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    act(() => {
      result.current[1]("hello")
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(onChangeAction).toHaveBeenCalledTimes(1)
    expect(onChangeAction).toHaveBeenCalledWith("hello")
  })

  it("should synchronize local value when externalValue changes", () => {
    const { result, rerender } = renderHook(
      ({ externalValue }) =>
        useDebouncedInput({
          externalValue,
          onChangeAction: vi.fn(),
          debounceMs: 300,
        }),
      {
        initialProps: {
          externalValue: "first",
        },
      }
    )

    expect(result.current[0]).toBe("first")

    rerender({
      externalValue: "updated",
    })

    expect(result.current[0]).toBe("updated")
  })

  it("should not trigger onChangeAction when localValue equals externalValue", () => {
    const onChangeAction = vi.fn()

    renderHook(() =>
      useDebouncedInput({
        externalValue: "same",
        onChangeAction,
        debounceMs: 300,
      })
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onChangeAction).not.toHaveBeenCalled()
  })

  it("should use the latest onChangeAction when callback changes before debounce completes", () => {
    const firstCallback = vi.fn()
    const secondCallback = vi.fn()

    const { result, rerender } = renderHook(
      ({ onChangeAction }) =>
        useDebouncedInput({
          externalValue: "",
          onChangeAction,
          debounceMs: 300,
        }),
      {
        initialProps: {
          onChangeAction: firstCallback,
        },
      }
    )

    act(() => {
      result.current[1]("hello")
    })

    rerender({
      onChangeAction: secondCallback,
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(firstCallback).not.toHaveBeenCalled()
    expect(secondCallback).toHaveBeenCalledTimes(1)
    expect(secondCallback).toHaveBeenCalledWith("hello")
  })

  it("should cancel pending debounce when unmounted", () => {
    const onChangeAction = vi.fn()

    const { result, unmount } = renderHook(() =>
      useDebouncedInput({
        externalValue: "",
        onChangeAction,
        debounceMs: 300,
      })
    )

    act(() => {
      result.current[1]("hello")
    })

    unmount()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(onChangeAction).not.toHaveBeenCalled()
  })
})
