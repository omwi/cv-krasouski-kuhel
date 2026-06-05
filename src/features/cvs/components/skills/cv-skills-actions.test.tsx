import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import SharedSkillsActions from "@/components/shared/skills/shared-skills-actions"
import CvSkillAddDialog from "@/features/cvs/components/skills/cv-skill-add-dialog"
import { useCvSkillsDelete } from "@/features/cvs/hooks/skills/use-cv-skill-delete"
import { usePermissions } from "@/hooks/use-permissions"
import { CvUserId } from "@/types/graphql-types"

import CvSkillsActions from "./cv-skills-actions"

vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: vi.fn(),
}))

vi.mock("@/features/cvs/hooks/skills/use-cv-skill-delete", () => ({
  useCvSkillsDelete: vi.fn(),
}))

vi.mock("@/components/shared/skills/shared-skills-actions", () => ({
  default: vi.fn(({ renderAddDialog }) => (
    <>
      {renderAddDialog
        ? renderAddDialog(<button data-testid="inner-trigger" />)
        : null}
    </>
  )),
}))

vi.mock("@/features/cvs/components/skills/cv-skill-add-dialog", () => ({
  default: vi.fn(({ children }) => <>{children}</>),
}))

describe("CvSkillsActions", () => {
  const mockCvUserId = {
    id: "cv-123",
    user: { id: "user-456" },
  } as unknown as CvUserId

  const mockCanUpdateCv = vi.fn()
  const mockDeleteHandlers = {
    handleStartDelete: vi.fn(),
    handleCancelDelete: vi.fn(),
    handleConfirmDelete: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(usePermissions).mockReturnValue({
      canUpdateCv: mockCanUpdateCv,
    } as unknown as ReturnType<typeof usePermissions>)

    vi.mocked(useCvSkillsDelete).mockReturnValue(
      mockDeleteHandlers as unknown as ReturnType<typeof useCvSkillsDelete>
    )
  })

  it("should configure SharedSkillsActions and render CvSkillAddDialog", () => {
    mockCanUpdateCv.mockReturnValue(true)

    render(<CvSkillsActions cvUserId={mockCvUserId} hasSkills={true} />)

    expect(mockCanUpdateCv).toHaveBeenCalledWith("user-456")
    expect(useCvSkillsDelete).toHaveBeenCalledWith(mockCvUserId)

    expect(vi.mocked(SharedSkillsActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        hasSkills: true,
        hasPermissions: true,
      })
    )

    // Invoke callbacks directly from mock calls
    const props = vi.mocked(SharedSkillsActions).mock.calls[0][0]

    props.handleStartDelete()
    expect(mockDeleteHandlers.handleStartDelete).toHaveBeenCalled()

    props.handleCancelDelete()
    expect(mockDeleteHandlers.handleCancelDelete).toHaveBeenCalled()

    props.handleConfirmDelete()
    expect(mockDeleteHandlers.handleConfirmDelete).toHaveBeenCalled()

    // Add dialog check
    expect(vi.mocked(CvSkillAddDialog).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        cvUserId: mockCvUserId,
      })
    )
    expect(screen.getByTestId("inner-trigger")).toBeInTheDocument()
  })

  it("should pass hasPermissions=false if update permission is denied", () => {
    mockCanUpdateCv.mockReturnValue(false)

    render(<CvSkillsActions cvUserId={mockCvUserId} hasSkills={true} />)

    expect(vi.mocked(SharedSkillsActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        hasPermissions: false,
      })
    )
  })
})
