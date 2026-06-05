import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { useRemoveCvProject } from "@/features/cvs/hooks/projects/use-remove-cv-project"
import { CvProject, CvUserId } from "@/types/graphql-types"

import RemoveCvProject from "./remove-cv-project"

vi.mock("@/features/cvs/hooks/projects/use-remove-cv-project", () => ({
  useRemoveCvProject: vi.fn(),
}))

vi.mock("@/components/shared/dialog/delete-dialog", () => ({
  DeleteDialog: vi.fn(() => <span />),
}))

describe("RemoveCvProject", () => {
  const mockCvProject = {
    id: "proj-1",
    name: "Legacy Migration",
  } as unknown as CvProject

  const mockCvUserId = {
    id: "cv-123",
  } as unknown as CvUserId

  const mockHandleDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRemoveCvProject).mockReturnValue({
      handleDelete: mockHandleDelete,
    })
  })

  it("should pass correct props to DeleteDialog and wire up onConfirm", () => {
    render(
      <RemoveCvProject
        cvProject={mockCvProject}
        cvUserId={mockCvUserId}
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    expect(useRemoveCvProject).toHaveBeenCalledWith(mockCvProject, mockCvUserId)

    const props = vi.mocked(DeleteDialog).mock.calls[0][0]
    expect(props).toEqual(
      expect.objectContaining({
        open: true,
        i18nKey: "cv-project-actions",
        entityName: "Legacy Migration",
        onConfirm: mockHandleDelete,
      })
    )

    // Invoke callback directly
    props.onConfirm?.()
    expect(mockHandleDelete).toHaveBeenCalled()
  })
})
