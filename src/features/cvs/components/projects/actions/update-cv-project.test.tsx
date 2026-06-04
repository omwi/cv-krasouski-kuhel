import { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { UseFormReturn } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import CvProjectFormDialog from "@/features/cvs/components/projects/actions/cv-project-form-dialog"
import { CvProjectFormValues } from "@/features/cvs/components/projects/actions/cv-project-schema"
import { useUpdateCvProject } from "@/features/cvs/hooks/projects/use-update-cv-project"
import { CvProject, CvUserId, Project } from "@/types/graphql-types"

import UpdateCvProject from "./update-cv-project"

vi.mock("@/features/cvs/hooks/projects/use-update-cv-project", () => ({
  useUpdateCvProject: vi.fn(),
}))

vi.mock(
  "@/features/cvs/components/projects/actions/cv-project-form-dialog",
  () => ({
    default: vi.fn(({ trigger, open, onOpenChange, title, submitLabel }) => (
      <div
        data-testid="cv-project-form-dialog"
        data-open={open}
        data-title={title}
        data-submit-label={submitLabel}
      >
        <button data-testid="close-btn" onClick={() => onOpenChange(false)} />
        {trigger}
      </div>
    )),
  })
)

describe("UpdateCvProject", () => {
  const mockCvProject = {
    id: "proj-1",
    name: "Legacy project",
  } as unknown as CvProject
  const mockCvUserId = { id: "cv-123" } as unknown as CvUserId

  const mockForm = {} as unknown as UseFormReturn<CvProjectFormValues>
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useUpdateCvProject).mockReturnValue({
      form: mockForm,
      onSubmit: mockOnSubmit,
      isSubmitReady: true,
      selectedProject: {
        id: "p-1",
        name: "Project Template",
      } as unknown as Project,
    } as unknown as ReturnType<typeof useUpdateCvProject>)
  })

  it("should support uncontrolled open state and pass correct properties to CvProjectFormDialog", () => {
    render(
      <UpdateCvProject cvProject={mockCvProject} cvUserId={mockCvUserId}>
        <button data-testid="trigger">Trigger Edit</button>
      </UpdateCvProject>
    )

    // Verify useUpdateCvProject call
    expect(useUpdateCvProject).toHaveBeenCalledWith(
      mockCvProject,
      mockCvUserId,
      expect.objectContaining({
        open: false,
        setOpen: expect.any(Function),
      })
    )

    // FormDialog call check
    expect(CvProjectFormDialog).toHaveBeenCalled()
    expect(vi.mocked(CvProjectFormDialog).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        open: false,
        title: "update.title",
        submitLabel: "update",
        form: mockForm,
        selectedProject: expect.objectContaining({ name: "Project Template" }),
        cvId: "cv-123",
        isUpdate: true,
      })
    )
  })

  it("should support controlled open state and react to trigger actions", () => {
    const ParentComponent = () => {
      const [open, setOpen] = useState(true)
      return (
        <UpdateCvProject
          cvProject={mockCvProject}
          cvUserId={mockCvUserId}
          open={open}
          onOpenChange={setOpen}
        />
      )
    }

    render(<ParentComponent />)

    expect(screen.getByTestId("cv-project-form-dialog")).toHaveAttribute(
      "data-open",
      "true"
    )

    // Click close
    fireEvent.click(screen.getByTestId("close-btn"))
    expect(screen.getByTestId("cv-project-form-dialog")).toHaveAttribute(
      "data-open",
      "false"
    )
  })
})
