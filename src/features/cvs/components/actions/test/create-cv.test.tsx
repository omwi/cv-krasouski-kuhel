import { fireEvent, render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { useCreateCvForm } from "../../../hooks/use-create-cv-form"
import CreateCv from "../create-cv"

// Mock custom hook
vi.mock("../../../hooks/use-create-cv-form", () => ({
  useCreateCvForm: vi.fn(),
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

// Mock CvFormFields to avoid rendering full heavy custom fields
vi.mock("../../cv-form-fields", () => ({
  default: () => <div data-testid="cv-form-fields">CvFormFields Mock</div>,
}))

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

  vi.mocked(useCreateCvForm).mockReturnValue({
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
    <CreateCv userId="123" currentUser={{ id: "admin-1" }}>
      <button data-testid="trigger-btn">Add CV</button>
    </CreateCv>
  )
}

describe("CreateCv Component", () => {
  it("should render mock FormDialog with CvFormFields", () => {
    render(<TestWrapper />)

    expect(screen.getByTestId("dialog-title")).toHaveTextContent("create.title")
    expect(screen.getByTestId("cv-form-fields")).toBeInTheDocument()
  })

  it("should trigger submit handler on form submission", () => {
    const mockOnSubmit = vi.fn()
    render(<TestWrapper onSubmitAction={mockOnSubmit} />)

    fireEvent.submit(screen.getByTestId("form-dialog"))

    expect(mockOnSubmit).toHaveBeenCalled()
  })
})
