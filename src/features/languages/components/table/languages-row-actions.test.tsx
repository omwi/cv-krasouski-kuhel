import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeleteLanguage from "@/features/languages/components/actions/delete-language"
import UpdateLanguage from "@/features/languages/components/actions/update-language"
import { TableLanguages } from "@/features/languages/components/table/languages-table-columns"

import LanguagesRowActions from "./languages-row-actions"

vi.mock("@/components/shared/data-table/entity-row-actions", () => ({
  EntityRowActions: vi.fn(({ renderEditModal, renderDeleteModal, entity }) => (
    <>
      {renderEditModal?.({ entity, open: true, onOpenChange: vi.fn() })}
      {renderDeleteModal?.({ entity, open: true, onOpenChange: vi.fn() })}
    </>
  )),
}))

vi.mock("@/features/languages/components/actions/update-language", () => ({
  default: vi.fn(() => <span />),
}))

vi.mock("@/features/languages/components/actions/delete-language", () => ({
  default: vi.fn(() => <span />),
}))

describe("LanguagesRowActions Component", () => {
  it("should configure EntityRowActions and pass correct props to Update/Delete dialogs", () => {
    const mockLanguage = {
      __typename: "Language",
      id: "lang-123",
      name: "English",
    } as unknown as TableLanguages

    render(<LanguagesRowActions language={mockLanguage} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        entity: mockLanguage,
        entityType: "languages",
        entityId: "lang-123",
      })
    )

    expect(vi.mocked(UpdateLanguage).mock.calls[0][0]).toEqual(
      expect.objectContaining({ language: mockLanguage })
    )

    expect(vi.mocked(DeleteLanguage).mock.calls[0][0]).toEqual(
      expect.objectContaining({ language: mockLanguage })
    )
  })

  it("should coerce numeric language id to string for entityId", () => {
    const mockLanguage = {
      __typename: "Language",
      id: 99,
      name: "French",
    } as unknown as TableLanguages

    vi.mocked(EntityRowActions).mockClear()

    render(<LanguagesRowActions language={mockLanguage} />)

    expect(vi.mocked(EntityRowActions).mock.calls[0][0].entityId).toBe("99")
  })
})
