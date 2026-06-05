import { useSuspenseQuery } from "@apollo/client/react"
import { render, screen } from "@testing-library/react"
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
    user: { __typename: "User", id: "user-123", email: "john@example.com" },
  }

  const mockOnSubmit = vi.fn((e) => e?.preventDefault())
  const mockRegister = vi.fn()
  const mockCanUpdateCv = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: { cv: mockCv },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    vi.mocked(usePermissions).mockReturnValue({
      canUpdateCv: mockCanUpdateCv,
    } as unknown as ReturnType<typeof usePermissions>)

    vi.mocked(useUpdateCvForm).mockReturnValue({
      onSubmit: mockOnSubmit,
      register: mockRegister,
      isSubmitting: false,
      isSubmitReady: true,
      errors: {},
      control: {} as unknown as ReturnType<typeof useUpdateCvForm>["control"],
    } as unknown as ReturnType<typeof useUpdateCvForm>)

    mockCanUpdateCv.mockReturnValue(true)
  })

  it("should render CvFormFields and submit button when user has update permissions", () => {
    render(<CvDetailsForm cvId="cv-123" />)

    expect(useSuspenseQuery).toHaveBeenCalledWith(expect.any(Object), {
      variables: { cvId: "cv-123" },
    })
    expect(useUpdateCvForm).toHaveBeenCalledWith(mockCv)

    expect(screen.getByLabelText(/name/i)).not.toHaveAttribute("readonly")
    expect(screen.getByRole("button", { name: "update" })).toBeInTheDocument()
  })

  it("should make fields readOnly and hide submit button when user lacks update permissions", () => {
    mockCanUpdateCv.mockReturnValue(false)

    render(<CvDetailsForm cvId="cv-123" />)

    expect(screen.getByLabelText(/name/i)).toHaveAttribute("readonly")
    expect(
      screen.queryByRole("button", { name: "update" })?.closest("div")
    ).toHaveClass("hidden")
  })
})
