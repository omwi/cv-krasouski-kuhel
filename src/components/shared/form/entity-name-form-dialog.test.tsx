import { PropsWithChildren } from "react"
import { render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { EntityNameFormDialog } from "./entity-name-form-dialog"

type TestFormValues = {
  name: string
}

const nameInputMock = vi.fn()

vi.mock("@/components/shared/dialog/form-dialog")

vi.mock("@/components/shared/input/name-input", () => ({
  NameInput: ({ isSubmitting }: { isSubmitting?: boolean }) => {
    nameInputMock({
      isSubmitting,
    })

    return <div data-testid="name-input" />
  },
}))

vi.mock("@/components/ui/field", () => ({
  FieldGroup: ({ children }: PropsWithChildren) => <div>{children}</div>,
}))

function TestHarness({
  isSubmitting = false,
  submitDisabled = false,
}: {
  isSubmitting?: boolean
  submitDisabled?: boolean
}) {
  const form = useForm<TestFormValues>({
    defaultValues: {
      name: "",
    },
  })

  return (
    <EntityNameFormDialog<TestFormValues>
      open
      onOpenChange={vi.fn()}
      title="Entity Dialog"
      onSubmit={vi.fn()}
      form={form}
      isSubmitting={isSubmitting}
      submitDisabled={submitDisabled}
    />
  )
}

describe("EntityNameFormDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render the dialog title", () => {
    render(<TestHarness />)

    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      "Entity Dialog"
    )
  })

  it("should render the name input", () => {
    render(<TestHarness />)

    expect(screen.getByTestId("name-input")).toBeInTheDocument()
  })

  it("should pass submitting state to NameInput", () => {
    render(<TestHarness isSubmitting />)

    expect(nameInputMock).toHaveBeenLastCalledWith({
      isSubmitting: true,
    })
  })

  it("should pass non-submitting state to NameInput by default", () => {
    render(<TestHarness />)

    expect(nameInputMock).toHaveBeenLastCalledWith({
      isSubmitting: false,
    })
  })
})
