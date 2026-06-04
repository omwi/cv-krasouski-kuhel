import { useSuspenseQuery } from "@apollo/client/react"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { SkillAddDialog } from "@/components/shared/skills/skill-add-dialog"
import { useCvSkillAddForm } from "@/features/cvs/hooks/skills/use-add-cv-skill-form"
import { CvUserId } from "@/types/graphql-types"

import CvSkillAddDialog from "./cv-skill-add-dialog"

vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
}))

vi.mock("@/features/cvs/hooks/skills/use-add-cv-skill-form", () => ({
  useCvSkillAddForm: vi.fn(),
}))

vi.mock("@/components/shared/skills/skill-add-dialog", () => ({
  SkillAddDialog: vi.fn(({ children, excludedSkillNames, open }) => (
    <div
      data-testid="skill-add-dialog"
      data-excluded={excludedSkillNames.join(",")}
      data-open={open}
    >
      {children}
    </div>
  )),
}))

describe("CvSkillAddDialog", () => {
  const mockCvUserId = {
    id: "cv-123",
  } as unknown as CvUserId

  const mockFormProps = {
    control: {} as unknown as ReturnType<typeof useCvSkillAddForm>["control"],
    reset: vi.fn(),
    isSubmitReady: true,
    onSubmit: vi.fn(),
    loading: false,
    open: true,
    setOpen: vi.fn(),
  }

  const mockSkills = [
    { id: "s-1", name: "React" },
    { id: "s-2", name: "GraphQL" },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useCvSkillAddForm).mockReturnValue(
      mockFormProps as unknown as ReturnType<typeof useCvSkillAddForm>
    )

    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: {
        cv: {
          skills: mockSkills,
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)
  })

  it("should render SkillAddDialog with mapped excludedSkillNames", () => {
    render(
      <CvSkillAddDialog cvUserId={mockCvUserId}>
        <button data-testid="trigger">Trigger</button>
      </CvSkillAddDialog>
    )

    expect(useCvSkillAddForm).toHaveBeenCalledWith(mockCvUserId)
    expect(useSuspenseQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ variables: { cvId: "cv-123" } })
    )

    expect(SkillAddDialog).toHaveBeenCalled()
    expect(vi.mocked(SkillAddDialog).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        open: true,
        excludedSkillNames: ["React", "GraphQL"],
      })
    )

    expect(screen.getByTestId("skill-add-dialog")).toBeInTheDocument()
    expect(screen.getByTestId("skill-add-dialog")).toHaveAttribute(
      "data-excluded",
      "React,GraphQL"
    )
    expect(screen.getByTestId("trigger")).toBeInTheDocument()
  })

  it("should handle null skills array in data response safely", () => {
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: {
        cv: {
          skills: null,
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)

    render(
      <CvSkillAddDialog cvUserId={mockCvUserId}>
        <button>Trigger</button>
      </CvSkillAddDialog>
    )

    expect(
      vi.mocked(SkillAddDialog).mock.calls[0][0].excludedSkillNames
    ).toEqual([])
  })
})
