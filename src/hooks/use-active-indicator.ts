import { RefObject, useLayoutEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { isEqualPath } from "@/utils/url"

export function useActiveIndicator(
  links: { href: string }[],
  navRef: RefObject<HTMLElement | null>,
  linkRefs: RefObject<(HTMLAnchorElement | null)[]>
) {
  const pathname = usePathname()
  const [indicatorStyle, setIndicatorStyle] = useState({
    opacity: 0,
    width: 0,
    transform: "translateX(0px)",
    transition: "none",
  })

  const activeIndex = links.findIndex((link) =>
    isEqualPath(link.href, pathname)
  )

  useLayoutEffect(() => {
    const navEl = navRef.current
    if (!navEl) return

    let isResizing = false

    function updatePosition() {
      if (!navEl) return

      if (activeIndex === -1) {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))
        return
      }

      const activeEl = linkRefs.current[activeIndex]
      if (!activeEl) return

      const navRect = navEl.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()

      setIndicatorStyle({
        opacity: 1,
        width: activeRect.width,
        transform: `translateX(${activeRect.left - navRect.left}px)`,
        transition: isResizing
          ? "none"
          : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
