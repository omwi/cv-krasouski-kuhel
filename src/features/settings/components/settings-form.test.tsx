import React from "react"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import SettingsForm from "./settings-form"

const push = vi.fn()
const refresh = vi.fn()
const setTheme = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh,
  }),
  usePathname: () => "",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}))

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string) => key,
    i18n: {
      language: "en",
      options: {
        supportedLngs: ["en", "de", "cimode"],
      },
    },
  }),
}))

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "system",
    setTheme,
  }),
}))

vi.mock("@/config/const", () => ({
  COOKIES: {
    LANGUAGE: "language",
  },
}))

vi.mock("@/components/ui/select", () => ({
  SelectItem: ({
    value,
    children,
  }: {
    value: string
    children: React.ReactNode
  }) => <div data-select-value={value}>{children}</div>,
}))

vi.mock("@/components/ui/floating-select", () => ({
  FloatingSelect: ({
    id,
    value,
    onValueChange,
    children,
    disabled,
  }: {
    id: string
    value: string
    onValueChange: (value: string) => void
    children: React.ReactNode
    disabled?: boolean
  }) => {
    type SelectItemProps = {
      value: string
      children?: React.ReactNode
    }

    const items = React.Children.toArray(
      children
    ) as React.ReactElement<SelectItemProps>[]

    return (
      <div data-testid={id} data-value={value}>
        {items.map((item) => (
          <button
            key={item.props.value}
            type="button"
            disabled={disabled}
            onClick={() => onValueChange(item.props.value)}
          >
            {item.props.value}
          </button>
        ))}
      </div>
    )
  },
}))

describe("SettingsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        pathname: "/settings",
        href: "",
      },
    })

    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    })
  })

  it("should render supported languages and exclude cimode", () => {
    render(<SettingsForm initialLang="en" />)

    expect(screen.getByRole("button", { name: "en" })).toBeInTheDocument()

    expect(screen.getByRole("button", { name: "de" })).toBeInTheDocument()

    expect(
      screen.queryByRole("button", { name: "cimode" })
    ).not.toBeInTheDocument()
  })

  it("should update theme when theme selection changes", async () => {
    const user = userEvent.setup()

    render(<SettingsForm initialLang="en" />)

    await user.click(screen.getByRole("button", { name: "dark" }))

    expect(setTheme).toHaveBeenCalledWith("dark")
  })

  it("should add locale segment, set cookie and refresh router when changing from system route to a language", async () => {
    const user = userEvent.setup()

    render(<SettingsForm initialLang="system" />)

    await user.click(screen.getByRole("button", { name: "de" }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/de/settings")
    })

    expect(refresh).toHaveBeenCalled()
    expect(document.cookie).toContain("language=de")
  })

  it("should replace existing locale segment when changing between languages", async () => {
    const user = userEvent.setup()

    window.location.pathname = "/en/settings"

    render(<SettingsForm initialLang="en" />)

    await user.click(screen.getByRole("button", { name: "de" }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/de/settings")
    })

    expect(refresh).toHaveBeenCalled()
    expect(document.cookie).toContain("language=de")
  })

  it("should clear cookie and redirect when selecting system language", async () => {
    const user = userEvent.setup()

    window.location.pathname = "/en/settings"

    render(<SettingsForm initialLang="en" />)

    const languageSelect = screen.getByTestId("language-select")

    await user.click(
      within(languageSelect).getByRole("button", { name: "system" })
    )

    await waitFor(() => {
      expect(window.location.href).toBe("/settings")
    })

    expect(push).not.toHaveBeenCalled()
    expect(refresh).not.toHaveBeenCalled()
    expect(document.cookie).toContain("language=")
    expect(document.cookie).toContain("expires=Thu, 01 Jan 1970 00:00:00 GMT")
  })

  it("should redirect without modifying path when system language is selected and no locale exists", async () => {
    const user = userEvent.setup()

    window.location.pathname = "/settings"

    render(<SettingsForm initialLang="en" />)

    const languageSelect = screen.getByTestId("language-select")

    await user.click(
      within(languageSelect).getByRole("button", { name: "system" })
    )

    await waitFor(() => {
      expect(window.location.href).toBe("/settings")
    })

    expect(push).not.toHaveBeenCalled()
    expect(refresh).not.toHaveBeenCalled()
  })
})
