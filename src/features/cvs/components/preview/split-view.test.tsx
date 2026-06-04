import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import SplitView from "./split-view"

describe("SplitView Component", () => {
  it("should render left and right content with a separator", () => {
    const { container } = render(
      <SplitView
        left={<div data-testid="left-side">Left Side</div>}
        right={<div data-testid="right-side">Right Side</div>}
      />
    )

    expect(screen.getByTestId("left-side")).toHaveTextContent("Left Side")
    expect(screen.getByTestId("right-side")).toHaveTextContent("Right Side")
    expect(
      container.querySelector('[data-slot="separator"]')
    ).toBeInTheDocument()
  })
})
