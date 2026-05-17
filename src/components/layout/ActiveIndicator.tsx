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
  useEffect(() => {
    const activeIndex = links.findIndex((link) => link.href === pathname)
    const indicator = indicatorRef.current
    const navEl = navRef.current

    if (!indicator || !navEl) return

    linkRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === activeIndex) {
        el.classList.add("active", "text-primary")
      } else {
        el.classList.remove("active", "text-primary")
      }
    })

    if (activeIndex === -1) {
      indicator.style.opacity = "0"
      return
    }

    const activeEl = linkRefs.current[activeIndex]
    if (!activeEl) return

    const navRect = navEl.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()

    indicator.style.opacity = "1"
    indicator.style.width = `${activeRect.width}px`
    indicator.style.transform = `translateX(${activeRect.left - navRect.left}px)`
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
