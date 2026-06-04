import { PropsWithChildren } from "react"
import { render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { EntityNameFormDialog } from "./entity-name-form-dialog"

type TestFormValues = {
  name: string
}

const nameInputMock = vi.fn()
const formDialogMock = vi.fn()

vi.mock("@/components/shared/dialog/form-dialog", () => ({
  FormDialog: ({
    children,
    title,
    isSubmitting,
    submitDisabled,
  }: PropsWithChildren<{
    title: string
    isSubmitting?: boolean
    submitDisabled?: boolean
  }>) => {
    formDialogMock({
      title,
      isSubmitting,
      submitDisabled,
    })

    return (
      <div>
        <h1>{title}</h1>
        {children}
      </div>
    )
  },
}))

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
  it("should render dialog and name input", () => {
    render(<TestHarness />)

    expect(
      screen.getByRole("heading", {
        name: "Entity Dialog",
      })
    ).toBeInTheDocument()

    expect(screen.getByTestId("name-input")).toBeInTheDocument()
  })

  it("should pass submitting state to NameInput", () => {
    render(<TestHarness isSubmitting />)

    expect(nameInputMock).toHaveBeenLastCalledWith({
      isSubmitting: true,
    })
  })

  it("should forward dialog props to FormDialog", () => {
    render(<TestHarness isSubmitting submitDisabled />)

    expect(formDialogMock).toHaveBeenLastCalledWith({
      title: "Entity Dialog",
      isSubmitting: true,
      submitDisabled: true,
    })
  })
})
