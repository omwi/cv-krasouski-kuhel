import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { useDebouncedInput } from "@/hooks/use-debounce-input"

import SearchPanel from "./search-panel"

vi.mock("@/hooks/use-debounce-input")

const mockedUseDebouncedInput = vi.mocked(useDebouncedInput)

describe("SearchPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render the current value", () => {
    const setLocalValue = vi.fn()

    mockedUseDebouncedInput.mockReturnValue(["frontend", setLocalValue])

    render(<SearchPanel value="frontend" onChangeAction={vi.fn()} />)

    expect(screen.getByRole("searchbox")).toHaveValue("frontend")
  })

  it("should render the translated placeholder", () => {
    const setLocalValue = vi.fn()

    mockedUseDebouncedInput.mockReturnValue(["", setLocalValue])

    render(<SearchPanel value="" onChangeAction={vi.fn()} />)

    expect(
      screen.getByPlaceholderText("search-placeholder")
    ).toBeInTheDocument()
  })

  it("should call the debounced setter when the user types", async () => {
    const user = userEvent.setup()
    const setLocalValue = vi.fn()

    mockedUseDebouncedInput.mockReturnValue(["", setLocalValue])

    render(<SearchPanel value="" onChangeAction={vi.fn()} />)

    await user.type(screen.getByRole("searchbox"), "abc")

    expect(setLocalValue).toHaveBeenCalledTimes(3)
    expect(setLocalValue).toHaveBeenNthCalledWith(1, "a")
    expect(setLocalValue).toHaveBeenNthCalledWith(2, "b")
    expect(setLocalValue).toHaveBeenNthCalledWith(3, "c")
  })

  it("should pass the expected configuration to useDebouncedInput", () => {
    const onChangeAction = vi.fn()
    const setLocalValue = vi.fn()

    mockedUseDebouncedInput.mockReturnValue(["", setLocalValue])

    render(
      <SearchPanel
        value="backend"
        debounceMs={500}
        onChangeAction={onChangeAction}
      />
    )

    expect(mockedUseDebouncedInput).toHaveBeenCalledWith({
      externalValue: "backend",
      onChangeAction,
      debounceMs: 500,
    })
  })
})
