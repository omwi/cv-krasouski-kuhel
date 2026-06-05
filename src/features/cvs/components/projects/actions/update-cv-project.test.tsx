import { render } from "@testing-library/react"
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
  () => ({ default: vi.fn(({ children }) => <>{children}</>) })
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

  it("should pass correct props to CvProjectFormDialog (uncontrolled state)", () => {
    render(
      <UpdateCvProject cvProject={mockCvProject} cvUserId={mockCvUserId}>
        <button>Trigger Edit</button>
      </UpdateCvProject>
    )

    expect(useUpdateCvProject).toHaveBeenCalledWith(
      mockCvProject,
      mockCvUserId,
      expect.objectContaining({ open: false, setOpen: expect.any(Function) })
    )

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

  it("should support controlled open state", () => {
    const mockOnOpenChange = vi.fn()

    const { rerender } = render(
      <UpdateCvProject
        cvProject={mockCvProject}
        cvUserId={mockCvUserId}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(vi.mocked(CvProjectFormDialog).mock.calls[0][0]).toEqual(
      expect.objectContaining({ open: true })
    )

    rerender(
      <UpdateCvProject
        cvProject={mockCvProject}
        cvUserId={mockCvUserId}
        open={false}
        onOpenChange={mockOnOpenChange}
      />
    )

    const lastCallProps = vi.mocked(CvProjectFormDialog).mock.calls.at(-1)?.[0]
    expect(lastCallProps).toEqual(expect.objectContaining({ open: false }))
  })
})
