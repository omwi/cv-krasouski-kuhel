import { render, screen } from "@testing-library/react"
import { UseFormReturn } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import CvProjectFormDialog from "@/features/cvs/components/projects/actions/cv-project-form-dialog"
import { CvProjectFormValues } from "@/features/cvs/components/projects/actions/cv-project-schema"
import { useAddCvProject } from "@/features/cvs/hooks/projects/use-add-cv-project"
import { CvUserId, Project } from "@/types/graphql-types"

import AddCvProject from "./add-cv-project"

vi.mock("@/features/cvs/hooks/projects/use-add-cv-project", () => ({
  useAddCvProject: vi.fn(),
}))

vi.mock(
  "@/features/cvs/components/projects/actions/cv-project-form-dialog",
  () => ({
    default: vi.fn(({ trigger, title, submitLabel }) => (
      <div
        data-testid="cv-project-form-dialog"
        data-title={title}
        data-submit-label={submitLabel}
      >
        {trigger}
      </div>
    )),
  })
)

describe("AddCvProject", () => {
  const mockCvUserId = {
    id: "cv-123",
    user: { id: "user-456", email: "user@example.com" },
  } as unknown as CvUserId

  const mockForm = {} as unknown as UseFormReturn<CvProjectFormValues>
  const mockOnSubmit = vi.fn()
  const mockSetOpen = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAddCvProject).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      isSubmitReady: true,
      selectedProject: {
        id: "proj-1",
        name: "E-Commerce",
        domain: "Retail",
      } as unknown as Project,
      open: true,
      setOpen: mockSetOpen,
    } as unknown as ReturnType<typeof useAddCvProject>)
  })

  it("should initialize useAddCvProject and render CvProjectFormDialog with correct props", () => {
    render(
      <AddCvProject cvUserId={mockCvUserId}>
        <button data-testid="trigger-btn">Add Project</button>
      </AddCvProject>
    )

    expect(useAddCvProject).toHaveBeenCalledWith(mockCvUserId)
    expect(CvProjectFormDialog).toHaveBeenCalled()
    expect(vi.mocked(CvProjectFormDialog).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        open: true,
        onOpenChange: mockSetOpen,
        title: "create.title", // mockT returns key
        submitLabel: "add",
        onSubmit: mockOnSubmit,
        isSubmitReady: true,
        form: mockForm,
        selectedProject: expect.objectContaining({ name: "E-Commerce" }),
        cvId: "cv-123",
      })
    )

    expect(screen.getByTestId("trigger-btn")).toBeInTheDocument()
  })
})
