"use client"

import { CSSProperties } from "react"

export default function ActiveIndicator({ style }: { style: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-primary will-change-transform"
      style={style}
    />
  )
}
