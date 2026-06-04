import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import SharedSkillsActions from "@/components/shared/skills/shared-skills-actions"
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
  default: vi.fn(
    ({
      hasSkills,
      hasPermissions,
      handleStartDelete,
      handleCancelDelete,
      handleConfirmDelete,
      renderAddDialog,
    }) => (
      <div
        data-testid="shared-skills-actions"
        data-has-skills={hasSkills}
        data-has-permissions={hasPermissions}
      >
        <button data-testid="start-del" onClick={handleStartDelete} />
        <button data-testid="cancel-del" onClick={handleCancelDelete} />
        <button data-testid="confirm-del" onClick={handleConfirmDelete} />
        <div data-testid="add-dialog-container">
          {renderAddDialog
            ? renderAddDialog(<button data-testid="inner-trigger" />)
            : null}
        </div>
      </div>
    )
  ),
}))

vi.mock("@/features/cvs/components/skills/cv-skill-add-dialog", () => ({
  default: vi.fn(({ children, cvUserId }) => (
    <div data-testid="cv-skill-add-dialog" data-cv-id={cvUserId.id}>
      {children}
    </div>
  )),
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

    expect(SharedSkillsActions).toHaveBeenCalled()
    expect(vi.mocked(SharedSkillsActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        hasSkills: true,
        hasPermissions: true,
        handleStartDelete: mockDeleteHandlers.handleStartDelete,
        handleCancelDelete: mockDeleteHandlers.handleCancelDelete,
        handleConfirmDelete: mockDeleteHandlers.handleConfirmDelete,
      })
    )

    // Trigger buttons check
    screen.getByTestId("start-del").click()
    expect(mockDeleteHandlers.handleStartDelete).toHaveBeenCalled()

    screen.getByTestId("cancel-del").click()
    expect(mockDeleteHandlers.handleCancelDelete).toHaveBeenCalled()

    screen.getByTestId("confirm-del").click()
    expect(mockDeleteHandlers.handleConfirmDelete).toHaveBeenCalled()

    // Add dialog check
    expect(screen.getByTestId("cv-skill-add-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("cv-skill-add-dialog")).toHaveAttribute(
      "data-cv-id",
      "cv-123"
    )
    expect(screen.getByTestId("inner-trigger")).toBeInTheDocument()
  })

  it("should pass hasPermissions=false if update permission is denied", () => {
    mockCanUpdateCv.mockReturnValue(false)

    render(<CvSkillsActions cvUserId={mockCvUserId} hasSkills={true} />)

    expect(screen.getByTestId("shared-skills-actions")).toHaveAttribute(
      "data-has-permissions",
      "false"
    )
  })
})
