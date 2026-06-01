import { fireEvent, render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { Cv } from "@/types/graphql-types"

import { useUpdateCvForm } from "../../../hooks/use-update-cv-form"
import UpdateCv from "../update-cv"

// Mock custom hook
vi.mock("../../../hooks/use-update-cv-form", () => ({
  useUpdateCvForm: vi.fn(),
}))

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string) => key,
  }),
}))

// Mock FormDialog to keep tests isolated and fast
vi.mock("@/components/shared/dialog/form-dialog", () => ({
  FormDialog: ({
    children,
    title,
    submitLabel,
    onSubmit,
  }: {
    children: React.ReactNode
    title: string
    submitLabel: string
    onSubmit: () => void
  }) => (
    <form
      data-testid="form-dialog"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <h2 data-testid="dialog-title">{title}</h2>
      <button type="submit">{submitLabel}</button>
      {children}
    </form>
  ),
}))

// Mock CvFormFields
vi.mock("../../cv-form-fields", () => ({
  default: () => <div data-testid="cv-form-fields">CvFormFields Mock</div>,
}))

const mockCv: Cv = {
  __typename: "Cv",
  id: "cv-456",
  name: "Original Name",
  description: "Description",
  education: "Education",
  user: {
    __typename: "User",
    id: "user-123",
    email: "user@example.com",
  },
}

const TestWrapper = ({
  onSubmitAction = vi.fn(),
}: {
  onSubmitAction?: () => void
}) => {
  const { register } = useForm<{
    name: string
    education: string
    description: string
  }>()

  vi.mocked(useUpdateCvForm).mockReturnValue({
    register,
    control: {} as ReturnType<
      typeof useForm<{ name: string; education: string; description: string }>
    >["control"],
    onSubmit: (e) => {
      e?.preventDefault()
      onSubmitAction()
      return Promise.resolve()
    },
    isSubmitReady: true,
    isSubmitting: false,
    errors: {},
  })

  return (
    <UpdateCv cv={mockCv}>
      <button data-testid="trigger-btn">Edit CV</button>
    </UpdateCv>
  )
}

describe("UpdateCv Component", () => {
  it("should render mock FormDialog with CvFormFields and correct title", () => {
    render(<TestWrapper />)

    expect(screen.getByTestId("dialog-title")).toHaveTextContent("update.title")
    expect(screen.getByTestId("cv-form-fields")).toBeInTheDocument()
  })

  it("should trigger submit handler on form submission", () => {
    const mockOnSubmit = vi.fn()
    render(<TestWrapper onSubmitAction={mockOnSubmit} />)

    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })
})
