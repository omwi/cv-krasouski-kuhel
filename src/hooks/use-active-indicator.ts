import { RefObject, useLayoutEffect, useReducer } from "react"
import { usePathname } from "next/navigation"

import { isEqualPath } from "@/utils/url"

type IndicatorState = {
  opacity: number
  width: number
  transform: string
  transition: string
}

type Action =
  | { type: "HIDE" }
  | {
      type: "SHOW"
      width: number
      left: number
      isResizing: boolean
    }

const initialIndicatorState: IndicatorState = {
  opacity: 0,
  width: 0,
  transform: "translateX(0px)",
  transition: "none",
}

function indicatorReducer(
  state: IndicatorState,
  action: Action
): IndicatorState {
  switch (action.type) {
    case "HIDE":
      return { ...state, opacity: 0 }
    case "SHOW":
      return {
        opacity: 1,
        width: action.width,
        transform: `translateX(${action.left}px)`,
        transition: action.isResizing
          ? "none"
          : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }
    default:
      return state
  }
}

export function useActiveIndicator(
  links: { href: string }[],
  navRef: RefObject<HTMLElement | null>,
  linkRefs: RefObject<(HTMLAnchorElement | null)[]>
) {
  const pathname = usePathname()
  const [indicatorStyle, dispatch] = useReducer(
    indicatorReducer,
    initialIndicatorState
  )

  const activeIndex = links.findIndex((link) =>
    isEqualPath(link.href, pathname)
  )

  useLayoutEffect(() => {
    const navEl = navRef.current
    if (!navEl) return

    let isResizing = false

    function updatePosition() {
      if (activeIndex === -1) {
        dispatch({ type: "HIDE" })
        return
      }

      const activeEl = linkRefs.current[activeIndex]
      if (!activeEl) return

      dispatch({
        type: "SHOW",
        width: activeEl.offsetWidth,
        left: activeEl.offsetLeft,
        isResizing,
      })
    }

    updatePosition()

    let resizeTimer: ReturnType<typeof setTimeout>
    let firstCall = true

    const observer = new ResizeObserver(() => {
      if (firstCall) {
        firstCall = false
        return
      }
      isResizing = true
      updatePosition()
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        isResizing = false
        updatePosition()
      }, 150)
    })

    observer.observe(navEl)

    return () => {
      observer.disconnect()
      clearTimeout(resizeTimer)
    }
  }, [activeIndex, linkRefs, navRef])

  return { activeIndex, indicatorStyle }
}
