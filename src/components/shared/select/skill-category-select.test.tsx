import { MockedProvider } from "@apollo/client/testing/react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import { GET_SKILL_CATEGORIES } from "@/graphql/skills/queries"

import { SkillCategorySelect } from "./skill-category-select"

const floatingSelectMock = vi.fn()

vi.mock("@/components/ui/floating-select", () => ({
  FloatingSelect: ({
    value,
    onValueChange,
    disabled,
    children,
  }: {
    value: string
    onValueChange: (value: string) => void
    disabled?: boolean
    children: React.ReactNode
  }) => {
    floatingSelectMock({
      value,
      onValueChange,
      disabled,
      children,
    })

    return (
      <div>
        <div data-testid="selected-value">{value}</div>
        <div data-testid="disabled-state">
          {disabled ? "disabled" : "enabled"}
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onValueChange("category-2")}
        >
          change-category
        </button>
        {children}
      </div>
    )
  },
}))

vi.mock("@/components/ui/select", () => ({
  SelectItem: ({
    value,
    children,
  }: {
    value: string
    children: React.ReactNode
  }) => <div data-testid={`select-item-${value}`}>{children}</div>,
}))

const mocks = [
  {
    request: {
      query: GET_SKILL_CATEGORIES,
    },
    result: {
      data: {
        skillCategories: [
          {
            __typename: "SkillCategory",
            id: "category-1",
            name: "Frontend",
            order: 1,
            parent: null,
            children: [],
          },
          {
            __typename: "SkillCategory",
            id: "category-2",
            name: "Backend",
            order: 2,
            parent: null,
            children: [],
          },
        ],
      },
    },
  },
]

describe("SkillCategorySelect", () => {
  beforeEach(() => {
    floatingSelectMock.mockClear()
  })

  it("should render the no category option and categories from the query", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <SkillCategorySelect value="none" onValueChangeAction={vi.fn()} />
      </MockedProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("select-item-category-1")).toBeInTheDocument()
    })

    expect(screen.getByTestId("select-item-none")).toBeInTheDocument()

    expect(screen.getByTestId("select-item-category-1")).toHaveTextContent(
      "Frontend"
    )

    expect(screen.getByTestId("select-item-category-2")).toHaveTextContent(
      "Backend"
    )
  })

  it("should call onValueChangeAction when a category is selected", async () => {
    const user = userEvent.setup()
    const onValueChangeAction = vi.fn()

    render(
      <MockedProvider mocks={mocks}>
        <SkillCategorySelect
          value="category-1"
          onValueChangeAction={onValueChangeAction}
        />
      </MockedProvider>
    )

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "change-category",
        })
      ).toBeEnabled()
    })

    await user.click(
      screen.getByRole("button", {
        name: "change-category",
      })
    )

    expect(onValueChangeAction).toHaveBeenCalledTimes(1)
    expect(onValueChangeAction).toHaveBeenCalledWith("category-2")
  })

  it("should be disabled when the disabled prop is true", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <SkillCategorySelect
          value="none"
          disabled
          onValueChangeAction={vi.fn()}
        />
      </MockedProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("disabled-state")).toHaveTextContent("disabled")
    })
  })
})
