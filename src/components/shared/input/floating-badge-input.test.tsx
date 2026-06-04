import { PropsWithChildren } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import FloatingBadgeInput from "./floating-badge-input"

vi.mock("@/components/ui/floating-label", () => ({
  FloatingLabel: ({
    children,
    htmlFor,
  }: PropsWithChildren<{
    htmlFor: string
  }>) => <label htmlFor={htmlFor}>{children}</label>,
}))

vi.mock("@/components/ui/tags-input", () => ({
  TagsInput: ({
    children,
    onValueChange,
  }: PropsWithChildren<{
    onValueChange?: (value: string[]) => void
  }>) => (
    <div>
      {children}
      <button
        type="button"
        data-testid="change-tags"
        onClick={() => onValueChange?.(["alpha", "beta"])}
      >
        change
      </button>
    </div>
  ),

  TagsInputList: ({ children }: PropsWithChildren) => <div>{children}</div>,

  TagsInputItem: ({
    children,
    value,
  }: PropsWithChildren<{
    value: string
  }>) => <div data-testid={`tag-${value}`}>{children}</div>,

  TagsInputInput: ({
    id,
    placeholder,
  }: {
    id: string
    placeholder?: string
  }) => <input data-testid="tags-input" id={id} placeholder={placeholder} />,
}))

describe("FloatingBadgeInput", () => {
  it("should render label and badge values", () => {
    render(<FloatingBadgeInput label="Resources" value={["alpha", "beta"]} />)

    expect(screen.getByText("Resources")).toBeInTheDocument()

    expect(screen.getByTestId("tag-alpha")).toBeInTheDocument()

    expect(screen.getByTestId("tag-beta")).toBeInTheDocument()
  })

  it("should render with empty values by default", () => {
    render(<FloatingBadgeInput label="Resources" />)

    expect(screen.queryByTestId("tag-alpha")).not.toBeInTheDocument()

    expect(screen.getByTestId("tags-input")).toBeInTheDocument()
  })

  it("should use provided id", () => {
    render(<FloatingBadgeInput id="resource-tags" label="Resources" />)

    expect(screen.getByTestId("tags-input")).toHaveAttribute(
      "id",
      "resource-tags"
    )
  })

  it("should generate an id when one is not provided", () => {
    render(<FloatingBadgeInput label="Resources" />)

    expect(screen.getByTestId("tags-input").getAttribute("id")).toBeTruthy()
  })

  it("should call onValueChange when tags change", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <FloatingBadgeInput label="Resources" onValueChange={onValueChange} />
    )

    await user.click(screen.getByTestId("change-tags"))

    expect(onValueChange).toHaveBeenCalledWith(["alpha", "beta"])
  })

  it("should set data-has-values correctly", () => {
    const { rerender, container } = render(
      <FloatingBadgeInput label="Resources" value={[]} />
    )

    expect(container.firstChild).toHaveAttribute("data-has-values", "false")

    rerender(<FloatingBadgeInput label="Resources" value={["alpha"]} />)

    expect(container.firstChild).toHaveAttribute("data-has-values", "true")
  })
})
