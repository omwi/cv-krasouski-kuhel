import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { TabLink } from "@/components/layout/tab-nav/tab-nav"

import ProfileLayout from "../layout"

vi.mock("@/components/layout/tab-nav/tab-nav", () => ({
  default: ({
    links,
    i18nNamespace,
  }: {
    links: TabLink[]
    i18nNamespace: string
  }) => (
    <div data-testid="tab-nav" data-namespace={i18nNamespace}>
      {links.map((link: TabLink) => (
        <a key={link.href} href={link.href} data-testid="tab-link">
          {link.i18nKey}
        </a>
      ))}
    </div>
  ),
}))

describe("ProfileLayout", () => {
  it("should render the component with correct child content and tab links", async () => {
    const params = Promise.resolve({ userId: "123" })
    const children = <div data-testid="test-child">Child Component Content</div>

    const jsx = await ProfileLayout({ children, params })
    render(jsx)

    const child = screen.getByTestId("test-child")
    expect(child).toBeInTheDocument()
    expect(child).toHaveTextContent("Child Component Content")

    const tabNav = screen.getByTestId("tab-nav")
    expect(tabNav).toBeInTheDocument()
    expect(tabNav).toHaveAttribute("data-namespace", "nav")

    const links = screen.getAllByTestId("tab-link")
    expect(links).toHaveLength(4)

    expect(links[0]).toHaveAttribute("href", "/users/123")
    expect(links[0]).toHaveTextContent("profile")

    expect(links[1]).toHaveAttribute("href", "/users/123/skills")
    expect(links[1]).toHaveTextContent("skills")

    expect(links[2]).toHaveAttribute("href", "/users/123/languages")
    expect(links[2]).toHaveTextContent("languages")

    expect(links[3]).toHaveAttribute("href", "/users/123/cvs")
    expect(links[3]).toHaveTextContent("cvs")
  })
})
