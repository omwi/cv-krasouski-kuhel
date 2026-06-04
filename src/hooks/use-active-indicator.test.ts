import { usePathname } from "next/navigation"
import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { isEqualPath } from "@/utils/url"

import { useActiveIndicator } from "./use-active-indicator"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}))

vi.mock("@/utils/url", () => ({
  isEqualPath: vi.fn(),
}))

type ResizeObserverCallback = ConstructorParameters<typeof ResizeObserver>[0]

class MockResizeObserver {
  static instance: MockResizeObserver | undefined

  callback: ResizeObserverCallback
  observe = vi.fn()
  disconnect = vi.fn()

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    MockResizeObserver.instance = this
  }

  trigger() {
    this.callback([], this as unknown as ResizeObserver)
  }
}

describe("useActiveIndicator", () => {
  beforeEach(() => {
    vi.useFakeTimers()

    Object.defineProperty(globalThis, "ResizeObserver", {
      writable: true,
      configurable: true,
      value: MockResizeObserver,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useRealTimers()
    MockResizeObserver.instance = undefined
  })

  function createAnchor(width: number, left: number): HTMLAnchorElement {
    const element = document.createElement("a")

    Object.defineProperty(element, "offsetWidth", {
      configurable: true,
      value: width,
    })

    Object.defineProperty(element, "offsetLeft", {
      configurable: true,
      value: left,
    })

    return element
  }

  it("should return the correct activeIndex for the matching pathname", () => {
    vi.mocked(usePathname).mockReturnValue("/about")

    vi.mocked(isEqualPath).mockImplementation(
      (href, pathname) => href === pathname
    )

    const navRef = {
      current: document.createElement("nav"),
    }

    const linkRefs = {
      current: [createAnchor(100, 0), createAnchor(120, 150)],
    }

    const links = [{ href: "/" }, { href: "/about" }]

    const { result } = renderHook(() =>
      useActiveIndicator(links, navRef, linkRefs)
    )

    expect(result.current.activeIndex).toBe(1)
  })

  it("should show indicator with correct width, position and animated transition", () => {
    vi.mocked(usePathname).mockReturnValue("/about")

    vi.mocked(isEqualPath).mockImplementation(
      (href, pathname) => href === pathname
    )

    const navRef = {
      current: document.createElement("nav"),
    }

    const linkRefs = {
      current: [createAnchor(100, 0), createAnchor(120, 150)],
    }

    const links = [{ href: "/" }, { href: "/about" }]

    const { result } = renderHook(() =>
      useActiveIndicator(links, navRef, linkRefs)
    )

    expect(result.current.indicatorStyle).toEqual({
      opacity: 1,
      width: 120,
      transform: "translateX(150px)",
      transition:
        "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    })
  })

  it("should hide indicator when no active link matches the pathname", () => {
    vi.mocked(usePathname).mockReturnValue("/missing")

    vi.mocked(isEqualPath).mockReturnValue(false)

    const navRef = {
      current: document.createElement("nav"),
    }

    const linkRefs = {
      current: [createAnchor(100, 0)],
    }

    const links = [{ href: "/" }]

    const { result } = renderHook(() =>
      useActiveIndicator(links, navRef, linkRefs)
    )

    expect(result.current.activeIndex).toBe(-1)

    expect(result.current.indicatorStyle.opacity).toBe(0)
  })

  it("should not update indicator when the active link element is missing", () => {
    vi.mocked(usePathname).mockReturnValue("/about")

    vi.mocked(isEqualPath).mockImplementation(
      (href, pathname) => href === pathname
    )

    const navRef = {
      current: document.createElement("nav"),
    }

    const linkRefs = {
      current: [null],
    }

    const links = [{ href: "/about" }]

    const { result } = renderHook(() =>
      useActiveIndicator(links, navRef, linkRefs)
    )

    expect(result.current.indicatorStyle).toEqual({
      opacity: 0,
      width: 0,
      transform: "translateX(0px)",
      transition: "none",
    })
  })

  it("should safely handle a missing nav element", () => {
    vi.mocked(usePathname).mockReturnValue("/about")

    vi.mocked(isEqualPath).mockImplementation(
      (href, pathname) => href === pathname
    )

    const navRef = {
      current: null,
    }

    const linkRefs = {
      current: [createAnchor(100, 50)],
    }

    const links = [{ href: "/about" }]

    const { result } = renderHook(() =>
      useActiveIndicator(links, navRef, linkRefs)
    )

    expect(result.current.activeIndex).toBe(0)

    expect(result.current.indicatorStyle).toEqual({
      opacity: 0,
      width: 0,
      transform: "translateX(0px)",
      transition: "none",
    })
  })

  it("should ignore the first ResizeObserver callback", () => {
    vi.mocked(usePathname).mockReturnValue("/about")

    vi.mocked(isEqualPath).mockImplementation(
      (href, pathname) => href === pathname
    )

    const navRef = {
      current: document.createElement("nav"),
    }

    const linkRefs = {
      current: [createAnchor(100, 40)],
    }

    const links = [{ href: "/about" }]

    const { result } = renderHook(() =>
      useActiveIndicator(links, navRef, linkRefs)
    )

    const initialTransition = result.current.indicatorStyle.transition

    act(() => {
      MockResizeObserver.instance?.trigger()
    })

    expect(result.current.indicatorStyle.transition).toBe(initialTransition)
  })

  it("should disable transitions during resize and restore transitions after resize settles", async () => {
    vi.mocked(usePathname).mockReturnValue("/about")

    vi.mocked(isEqualPath).mockImplementation(
      (href, pathname) => href === pathname
    )

    const navRef = {
      current: document.createElement("nav"),
    }

    const linkRefs = {
      current: [createAnchor(120, 80)],
    }

    const links = [{ href: "/about" }]

    const { result } = renderHook(() =>
      useActiveIndicator(links, navRef, linkRefs)
    )

    act(() => {
      MockResizeObserver.instance?.trigger()
    })

    act(() => {
      MockResizeObserver.instance?.trigger()
    })

    expect(result.current.indicatorStyle).toMatchObject({
      opacity: 1,
      width: 120,
      transform: "translateX(80px)",
      transition: "none",
    })

    await act(async () => {
      vi.runAllTimers()
    })

    expect(result.current.indicatorStyle).toMatchObject({
      opacity: 1,
      width: 120,
      transform: "translateX(80px)",
      transition:
        "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    })
  })

  it("should disconnect the ResizeObserver and clear timers on unmount", () => {
    vi.mocked(usePathname).mockReturnValue("/about")

    vi.mocked(isEqualPath).mockImplementation(
      (href, pathname) => href === pathname
    )

    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout")

    const navRef = {
      current: document.createElement("nav"),
    }

    const linkRefs = {
      current: [createAnchor(120, 80)],
    }

    const links = [{ href: "/about" }]

    const { unmount } = renderHook(() =>
      useActiveIndicator(links, navRef, linkRefs)
    )

    unmount()

    expect(MockResizeObserver.instance?.disconnect).toHaveBeenCalledTimes(1)

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
