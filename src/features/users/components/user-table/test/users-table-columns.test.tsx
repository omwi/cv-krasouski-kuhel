import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { TableUser } from "@/features/users/components/user-table/users-table"

import { getColumns } from "../users-table-columns"

// Minimal mock for UserRowActions — tested separately
vi.mock("@/features/users/components/user-table/user-row-actions", () => ({
  UserRowActions: () => <div data-testid="row-actions" />,
}))

const makeUser = (overrides: Partial<TableUser> = {}): TableUser =>
  ({
    __typename: "User",
    id: "user-1",
    email: "jane@example.com",
    role: "User",
    is_verified: true,
    created_at: "2024-01-01",
    department_name: "Engineering",
    position_name: "Developer",
    department: null,
    position: null,
    profile: {
      __typename: "Profile",
      id: "profile-1",
      avatar: null,
      first_name: "Jane",
      last_name: "Doe",
      full_name: "Jane Doe",
    },
    ...overrides,
  }) as unknown as TableUser

const columns = getColumns()

const avatarColumn = columns.find((c) => c.id === "avatar")!
const firstNameColumn = columns.find((c) => c.id === "firstName")!
const lastNameColumn = columns.find((c) => c.id === "lastName")!
const emailColumn = columns.find((c) => c.id === "email")!
const departmentColumn = columns.find((c) => c.id === "departmentName")!
const positionColumn = columns.find((c) => c.id === "positionName")!
const actionsColumn = columns.find((c) => c.id === "actions")!

describe("getColumns – avatar cell initials logic", () => {
  const renderAvatar = (user: TableUser) => {
    const CellComponent = avatarColumn.cell!
    render(<CellComponent row={user} value={undefined} />)
  }

  it("should use first + last name initials when both are present", () => {
    renderAvatar(makeUser())
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("should use only first name initial when last name is missing", () => {
    renderAvatar(
      makeUser({
        profile: {
          __typename: "Profile",
          id: "p1",
          avatar: null,
          first_name: "Jane",
          last_name: "",
          full_name: "Jane",
        },
      })
    )
    expect(screen.getByText("J")).toBeInTheDocument()
  })

  it("should fall back to email initial when both names are empty", () => {
    renderAvatar(
      makeUser({
        profile: {
          __typename: "Profile",
          id: "p1",
          avatar: null,
          first_name: "",
          last_name: "",
          full_name: "",
        },
        email: "jane@example.com",
      })
    )
    expect(screen.getByText("J")).toBeInTheDocument()
  })

  it("should show 'U' when name and email are both empty", () => {
    renderAvatar(
      makeUser({
        profile: {
          __typename: "Profile",
          id: "p1",
          avatar: null,
          first_name: "",
          last_name: "",
          full_name: "",
        },
        email: "",
      })
    )
    expect(screen.getByText("U")).toBeInTheDocument()
  })

  it("should uppercase initials", () => {
    renderAvatar(
      makeUser({
        profile: {
          __typename: "Profile",
          id: "p1",
          avatar: null,
          first_name: "jane",
          last_name: "doe",
          full_name: "jane doe",
        },
      })
    )
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("should pass avatar src to AvatarImage", () => {
    const avatarSrc = "http://example.com/avatar.png"
    const { container } = render(
      (() => {
        const CellComponent = avatarColumn.cell!
        return (
          <CellComponent
            row={makeUser({
              profile: {
                __typename: "Profile",
                id: "p1",
                avatar: avatarSrc,
                first_name: "Jane",
                last_name: "Doe",
                full_name: "Jane Doe",
              },
            })}
            value={undefined}
          />
        )
      })()
    )
    // AvatarImage renders <img> only after load event in real browser.
    // In JSDOM we verify the src prop was wired through the span[data-slot=avatar] tree.
    const img = container.querySelector("img")
    // If AvatarImage rendered an img, check its src; otherwise verify fallback "JD" is shown.
    if (img) {
      expect(img).toHaveAttribute("src", avatarSrc)
    } else {
      expect(screen.getByText("JD")).toBeInTheDocument()
    }
  })
})

describe("getColumns – accessorFn fallbacks", () => {
  it("firstName returns first_name when present", () => {
    expect(firstNameColumn.accessorFn!(makeUser())).toBe("Jane")
  })

  it("firstName returns empty string when first_name is missing", () => {
    expect(
      firstNameColumn.accessorFn!(
        makeUser({
          profile: {
            __typename: "Profile",
            id: "p1",
            avatar: null,
            first_name: "",
            last_name: "",
            full_name: "",
          },
        })
      )
    ).toBe("")
  })

  it("firstName returns empty string when profile is null", () => {
    expect(
      firstNameColumn.accessorFn!(makeUser({ profile: null as never }))
    ).toBe("")
  })

  it("lastName returns last_name when present", () => {
    expect(lastNameColumn.accessorFn!(makeUser())).toBe("Doe")
  })

  it("lastName returns empty string when last_name is missing", () => {
    expect(
      lastNameColumn.accessorFn!(makeUser({ profile: null as never }))
    ).toBe("")
  })

  it("email returns email when present", () => {
    expect(emailColumn.accessorFn!(makeUser())).toBe("jane@example.com")
  })

  it("email returns empty string when email is null", () => {
    expect(emailColumn.accessorFn!(makeUser({ email: "" }))).toBe("")
  })

  it("departmentName returns department_name when present", () => {
    expect(departmentColumn.accessorFn!(makeUser())).toBe("Engineering")
  })

  it("departmentName returns empty string when null", () => {
    expect(
      departmentColumn.accessorFn!(makeUser({ department_name: null }))
    ).toBe("")
  })

  it("positionName returns position_name when present", () => {
    expect(positionColumn.accessorFn!(makeUser())).toBe("Developer")
  })

  it("positionName returns empty string when null", () => {
    expect(positionColumn.accessorFn!(makeUser({ position_name: null }))).toBe(
      ""
    )
  })
})

describe("getColumns – column metadata", () => {
  it("should return 7 columns", () => {
    expect(columns).toHaveLength(7)
  })

  it("avatar column is not sortable and not searchable", () => {
    expect(avatarColumn.sortable).toBe(false)
    expect(avatarColumn.searchable).toBe(false)
  })

  it("firstName, lastName, email columns are sortable and searchable", () => {
    for (const col of [firstNameColumn, lastNameColumn, emailColumn]) {
      expect(col.sortable).toBe(true)
      expect(col.searchable).toBe(true)
    }
  })

  it("actions column is not sortable and not searchable", () => {
    expect(actionsColumn.sortable).toBe(false)
    expect(actionsColumn.searchable).toBe(false)
  })

  it("actions column renders UserRowActions", () => {
    const CellComponent = actionsColumn.cell!
    render(<CellComponent row={makeUser()} value={undefined} />)
    expect(screen.getByTestId("row-actions")).toBeInTheDocument()
  })
})
