"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

import { SliderProps } from "@/types/tab-header"

export default function ActiveIndicator({
  links,
  linkRefs,
  navRef,
}: SliderProps) {
  const pathname = usePathname()
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const isResizingRef = useRef(false)

  useEffect(() => {
    const indicator = indicatorRef.current
    const navEl = navRef.current
    if (!indicator || !navEl) return

    const activeIndex = links.findIndex((link) => link.href === pathname)

    linkRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === activeIndex) {
        el.classList.add("active", "text-primary")
      } else {
        el.classList.remove("active", "text-primary")
      }
    })

    function updatePosition() {
      if (!indicator || !navEl) return

      if (activeIndex === -1) {
        indicator.style.opacity = "0"
        return
      }

      const activeEl = linkRefs.current[activeIndex]
      if (!activeEl) return

      const navRect = navEl.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()

      indicator.style.transition = isResizingRef.current
        ? "none"
        : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"

      indicator.style.opacity = "1"
      indicator.style.width = `${activeRect.width}px`
      indicator.style.transform = `translateX(${activeRect.left - navRect.left}px)`
    }

    updatePosition()

    let resizeTimer: ReturnType<typeof setTimeout>
    let firstCall = true
    const observer = new ResizeObserver(() => {
      if (firstCall) {
        firstCall = false
        return
      }
      isResizingRef.current = true
      updatePosition()
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        isResizingRef.current = false
      }, 150)
    })
    observer.observe(navEl)

    return () => {
      observer.disconnect()
      clearTimeout(resizeTimer)
    }
  }, [pathname, links, linkRefs, navRef])

  return (
    <span
      ref={indicatorRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: "2px",
        opacity: 0,
        backgroundColor: "currentColor",
        transform: "translateX(0px)",
        transition:
          "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform, width",
        pointerEvents: "none",
      }}
      className="text-primary"
    />
  )
}
