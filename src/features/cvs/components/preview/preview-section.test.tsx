import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import PreviewSection from "./preview-section"

describe("PreviewSection Component", () => {
  it("should render heading as string and children content", () => {
    render(
      <PreviewSection heading="My Section Heading">
        <div data-testid="child">Section Content</div>
      </PreviewSection>
    )

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "My Section Heading",
    })
    expect(heading).toBeInTheDocument()

    const child = screen.getByTestId("child")
    expect(child).toBeInTheDocument()
    expect(child).toHaveTextContent("Section Content")
  })

  it("should render heading as ReactNode and children content", () => {
    render(
      <PreviewSection
        heading={<h1 data-testid="custom-heading">Custom Heading</h1>}
      >
        <div data-testid="child">Section Content</div>
      </PreviewSection>
    )

    const heading = screen.getByTestId("custom-heading")
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent("Custom Heading")

    const child = screen.getByTestId("child")
    expect(child).toBeInTheDocument()
  })
})
