import { useSuspenseQuery } from "@apollo/client/react"
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useUpdateCvForm } from "@/features/cvs/hooks/use-update-cv-form"
import { usePermissions } from "@/hooks/use-permissions"
import { Cv } from "@/types/graphql-types"

import CvDetailsForm from "./cv-details-form"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
}))

vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: vi.fn(),
}))

vi.mock("@/features/cvs/hooks/use-update-cv-form", () => ({
  useUpdateCvForm: vi.fn(),
}))

describe("CvDetailsForm Component", () => {
  const mockCv: Cv = {
    __typename: "Cv",
    id: "cv-123",
    name: "John Doe's CV",
    description: "Experienced dev",
    education: "BSc Computer Science",
    user: {
      __typename: "User",
      id: "user-123",
      email: "john@example.com",
    },
  }

  const mockOnSubmit = vi.fn((e) => e?.preventDefault())
  const mockRegister = vi.fn()

  const mockPermissions = {
    canUpdateCv: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: { cv: mockCv },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    vi.mocked(usePermissions).mockReturnValue(
      mockPermissions as unknown as ReturnType<typeof usePermissions>
    )

    vi.mocked(useUpdateCvForm).mockReturnValue({
      onSubmit: mockOnSubmit,
      register: mockRegister,
      isSubmitting: false,
      isSubmitReady: true,
      errors: {},
      control: {} as unknown as ReturnType<typeof useUpdateCvForm>["control"],
    } as unknown as ReturnType<typeof useUpdateCvForm>)

    mockPermissions.canUpdateCv.mockReturnValue(true)
  })

  it("should render CvFormFields and submit button when user has update permissions", () => {
    render(<CvDetailsForm cvId="cv-123" />)

    expect(useSuspenseQuery).toHaveBeenCalledWith(expect.any(Object), {
      variables: { cvId: "cv-123" },
    })
    expect(useUpdateCvForm).toHaveBeenCalledWith(mockCv)

    const nameInput = screen.getByLabelText(/name/i)
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).not.toHaveAttribute("readonly")

    const submitBtn = screen.getByRole("button", { name: "update" })
    expect(submitBtn).toBeInTheDocument()

    // Trigger form submit
    fireEvent.submit(
      screen.getByRole("button", { name: "update" }).closest("form")!
    )
    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it("should make fields readOnly and hide submit button when user does not have update permissions", () => {
    mockPermissions.canUpdateCv.mockReturnValue(false)

    render(<CvDetailsForm cvId="cv-123" />)

    const nameInput = screen.getByLabelText(/name/i)
    expect(nameInput).toHaveAttribute("readonly")

    // The submit button wrapper div should be hidden
    const submitBtn = screen.queryByRole("button", { name: "update" })
    expect(submitBtn?.closest("div")).toHaveClass("hidden")
  })
})
