import { render, screen } from "@testing-library/react"
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import CvFormFields from "./cv-form-fields"

type FormValues = {
  name: string
  education: string
  description: string
}

describe("CvFormFields Component", () => {
  const TestWrapper = ({
    errors = {},
    disabled = false,
    readOnly = false,
  }: {
    errors?: FieldErrors<FormValues>
    disabled?: boolean
    readOnly?: boolean
  }) => {
    const { register } = useForm<FormValues>({
      defaultValues: {
        name: "",
        education: "",
        description: "",
      },
    })

    const spyRegister = vi
      .fn()
      .mockImplementation(
        (...args: Parameters<UseFormRegister<FormValues>>) => {
          return register(...args)
        }
      ) as unknown as UseFormRegister<FormValues>

    return (
      <CvFormFields
        register={spyRegister}
        errors={errors}
        disabled={disabled}
        readOnly={readOnly}
      />
    )
  }

  it("should render all form inputs with correct labels and required fields", () => {
    render(<TestWrapper />)

    const nameInput = screen.getByLabelText(/name/i)
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveAttribute("id", "name")
    expect(nameInput).toHaveAttribute("required")

    const educationInput = screen.getByLabelText(/education/i)
    expect(educationInput).toBeInTheDocument()
    expect(educationInput).toHaveAttribute("id", "education")
    expect(educationInput).not.toHaveAttribute("required")

    const descriptionInput = screen.getByLabelText(/description/i)
    expect(descriptionInput).toBeInTheDocument()
    expect(descriptionInput).toHaveAttribute("id", "description")
    expect(descriptionInput).toHaveAttribute("required")
  })

  it("should display field errors when present", () => {
    const mockErrors: FieldErrors<FormValues> = {
      name: { type: "required", message: "Name is required" },
      education: { type: "pattern", message: "Education error message" },
      description: { type: "minLength", message: "Description is too short" },
    }

    render(<TestWrapper errors={mockErrors} />)

    expect(screen.getByText("Name is required")).toBeInTheDocument()
    expect(screen.getByText("Education error message")).toBeInTheDocument()
    expect(screen.getByText("Description is too short")).toBeInTheDocument()
  })

  it("should apply disabled attribute to inputs when disabled prop is true", () => {
    render(<TestWrapper disabled={true} />)

    expect(screen.getByLabelText(/name/i)).toBeDisabled()
    expect(screen.getByLabelText(/education/i)).toBeDisabled()
    expect(screen.getByLabelText(/description/i)).toBeDisabled()
  })

  it("should apply readOnly attribute to inputs when readOnly prop is true", () => {
    render(<TestWrapper readOnly={true} />)

    expect(screen.getByLabelText(/name/i)).toHaveAttribute("readonly")
    expect(screen.getByLabelText(/education/i)).toHaveAttribute("readonly")
    expect(screen.getByLabelText(/description/i)).toHaveAttribute("readonly")
  })
})
