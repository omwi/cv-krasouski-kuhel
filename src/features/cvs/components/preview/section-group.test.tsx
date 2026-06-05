import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import SectionGroup from "./section-group"

describe("SectionGroup Component", () => {
  it("should render default variant with text content", () => {
    render(
      <SectionGroup heading="My Heading" content="Single string content" />
    )

    const heading = screen.getByRole("heading", {
      level: 3,
      name: "My Heading",
    })
    expect(heading).toBeInTheDocument()
    expect(heading).not.toHaveClass("text-primary")

    const content = screen.getByText("Single string content")
    expect(content).toBeInTheDocument()
  })

  it("should render primary variant with list-like array content joined by comma when isList is false", () => {
    render(
      <SectionGroup
        heading="My Primary Heading"
        content={["React", "Node", "TypeScript"]}
        variant="primary"
      />
    )

    const heading = screen.getByRole("heading", {
      level: 3,
      name: "My Primary Heading",
    })
    expect(heading).toHaveClass("text-primary")

    const content = screen.getByText("React, Node, TypeScript")
    expect(content).toBeInTheDocument()
  })

  it("should render content as bullet list when isList is true", () => {
    render(
      <SectionGroup
        heading="Responsibilities"
        content={["Developed feature A", "Fixed bug B"]}
        isList={true}
      />
    )

    expect(screen.getByRole("list")).toBeInTheDocument()
    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent("Developed feature A")
    expect(items[1]).toHaveTextContent("Fixed bug B")
  })

  it("should render single string content as single bullet when isList is true", () => {
    render(
      <SectionGroup
        heading="Responsibilities"
        content="Single responsibility"
        isList={true}
      />
    )

    expect(screen.getByRole("list")).toBeInTheDocument()
    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent("Single responsibility")
  })

  it("should render dash '–' when content is empty string or empty array", () => {
    const { rerender } = render(<SectionGroup heading="Empty" content="   " />)
    expect(screen.getByText("–")).toBeInTheDocument()

    rerender(<SectionGroup heading="Empty" content={[]} />)
    expect(screen.getByText("–")).toBeInTheDocument()
  })
})
