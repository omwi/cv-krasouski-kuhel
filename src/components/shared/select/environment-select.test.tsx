import {
  MockedProvider,
  MockedProviderProps,
} from "@apollo/client/testing/react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { GET_SKILLS } from "@/graphql/skills/queries"

import { EnvironmentSelect } from "./environment-select"

let comboboxOptions: Array<{
  value: string
  label: string
}> = []

let comboboxDisabled = false

vi.mock("@/components/ui/combobox", () => ({
  Combobox: ({
    options,
    disabled,
    value,
    onValueChange,
  }: {
    options: Array<{
      value: string
      label: string
    }>
    disabled?: boolean
    value: string[]
    onValueChange: (value: string[]) => void
  }) => {
    comboboxOptions = options
    comboboxDisabled = Boolean(disabled)

    return (
      <div>
        <div data-testid="value">{value.join(",")}</div>

        <div data-testid="disabled">{String(disabled)}</div>

        <button
          type="button"
          data-testid="change-value"
          onClick={() => onValueChange(["React", "TypeScript"])}
        >
          change
        </button>
      </div>
    )
  },
}))

function renderComponent(
  mocks: MockedProviderProps["mocks"],
  disabled = false
) {
  const onValueChange = vi.fn()

  render(
    <MockedProvider mocks={mocks}>
      <EnvironmentSelect
        value={[]}
        disabled={disabled}
        onValueChange={onValueChange}
      />
    </MockedProvider>
  )

  return { onValueChange }
}

describe("EnvironmentSelect", () => {
  beforeEach(() => {
    comboboxOptions = []
    comboboxDisabled = false
  })

  it("should render mapped skill options", async () => {
    renderComponent([
      {
        request: {
          query: GET_SKILLS,
        },
        result: {
          data: {
            skills: [
              {
                id: "1",
                name: "React",
                category_name: null,
                category_parent_name: null,
                created_at: "",
                category: null,
                __typename: "Skill",
              },
              {
                id: "2",
                name: "TypeScript",
                category_name: null,
                category_parent_name: null,
                created_at: "",
                category: null,
                __typename: "Skill",
              },
            ],
          },
        },
      },
    ])

    await waitFor(() => {
      expect(comboboxOptions).toEqual([
        {
          value: "React",
          label: "React",
        },
        {
          value: "TypeScript",
          label: "TypeScript",
        },
      ])
    })
  })

  it("should render empty options when no skills exist", async () => {
    renderComponent([
      {
        request: {
          query: GET_SKILLS,
        },
        result: {
          data: {
            skills: [],
          },
        },
      },
    ])

    await waitFor(() => {
      expect(comboboxOptions).toEqual([])
    })
  })

  it("should disable combobox when disabled prop is true", async () => {
    renderComponent(
      [
        {
          request: {
            query: GET_SKILLS,
          },
          result: {
            data: {
              skills: [],
            },
          },
        },
      ],
      true
    )

    await waitFor(() => {
      expect(comboboxDisabled).toBe(true)
    })
  })

  it("should propagate value changes", async () => {
    const user = userEvent.setup()

    const { onValueChange } = renderComponent([
      {
        request: {
          query: GET_SKILLS,
        },
        result: {
          data: {
            skills: [],
          },
        },
      },
    ])

    await user.click(await screen.findByTestId("change-value"))

    expect(onValueChange).toHaveBeenCalledWith(["React", "TypeScript"])
  })
})
