import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useTableUrlState } from "@/hooks/use-table-url-state"

const pathname = "/users"

const replaceMock = vi.fn()

let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
  usePathname: () => pathname,
  useSearchParams: () => searchParams,
}))

function getLastNavigationUrl(): URL {
  const lastCall = replaceMock.mock.calls.at(-1)

  if (!lastCall) {
    throw new Error("Expected router.replace to be called")
  }

  const [url] = lastCall

  if (typeof url !== "string") {
    throw new Error("Expected first router.replace argument to be a string")
  }

  return new URL(url, "http://localhost")
}

describe("useTableUrlState", () => {
  beforeEach(() => {
    replaceMock.mockReset()
    searchParams = new URLSearchParams()
  })

  describe("params", () => {
    it("should return params from query string", () => {
      searchParams = new URLSearchParams({
        page: "3",
        perPage: "50",
        search: "john",
        sortBy: "name",
        sortOrder: "asc",
      })

      const { result } = renderHook(() => useTableUrlState())

      expect(result.current.params).toEqual({
        page: 3,
        perPage: 50,
        search: "john",
        sortBy: "name",
        sortOrder: "asc",
      })
    })

    it("should use built-in defaults when query params are missing", () => {
      const { result } = renderHook(() => useTableUrlState())

      expect(result.current.params).toEqual({
        page: 1,
        perPage: 20,
        search: "",
        sortBy: "id",
        sortOrder: "desc",
      })
    })

    it("should use provided defaults when query params are missing", () => {
      const { result } = renderHook(() =>
        useTableUrlState({
          defaultSortBy: "name",
          defaultSortOrder: "asc",
          defaultPerPage: 100,
        })
      )

      expect(result.current.params).toEqual({
        page: 1,
        perPage: 100,
        search: "",
        sortBy: "name",
        sortOrder: "asc",
      })
    })

    it("should fall back to default sort order when sortOrder is invalid", () => {
      searchParams = new URLSearchParams({
        sortOrder: "invalid",
      })

      const { result } = renderHook(() => useTableUrlState())

      expect(result.current.params.sortOrder).toBe("desc")
    })

    it("should fall back to page 1 when page is invalid", () => {
      searchParams = new URLSearchParams({
        page: "abc",
      })

      const { result } = renderHook(() => useTableUrlState())

      expect(result.current.params.page).toBe(1)
    })

    it("should fall back to default perPage when perPage is invalid", () => {
      searchParams = new URLSearchParams({
        perPage: "abc",
      })

      const { result } = renderHook(() =>
        useTableUrlState({
          defaultPerPage: 50,
        })
      )

      expect(result.current.params.perPage).toBe(50)
    })

    it("should return empty search when search is missing", () => {
      const { result } = renderHook(() => useTableUrlState())

      expect(result.current.params.search).toBe("")
    })
  })

  describe("updateParams", () => {
    it("should update a single parameter", () => {
      const { result } = renderHook(() => useTableUrlState())

      act(() => {
        result.current.updateParams({
          page: 2,
        })
      })

      const url = getLastNavigationUrl()

      expect(url.pathname).toBe(pathname)
      expect(url.searchParams.get("page")).toBe("2")
    })

    it("should update multiple parameters", () => {
      const { result } = renderHook(() => useTableUrlState())

      act(() => {
        result.current.updateParams({
          page: 2,
          search: "john",
        })
      })

      const url = getLastNavigationUrl()

      expect(url.pathname).toBe(pathname)
      expect(url.searchParams.get("page")).toBe("2")
      expect(url.searchParams.get("search")).toBe("john")
    })

    it("should preserve existing parameters when updating another parameter", () => {
      searchParams = new URLSearchParams({
        page: "5",
        sortBy: "name",
      })

      const { result } = renderHook(() => useTableUrlState())

      act(() => {
        result.current.updateParams({
          search: "john",
        })
      })

      const url = getLastNavigationUrl()

      expect(url.pathname).toBe(pathname)
      expect(url.searchParams.get("page")).toBe("1")
      expect(url.searchParams.get("sortBy")).toBe("name")
      expect(url.searchParams.get("search")).toBe("john")
    })

    it("should remove parameter when value is undefined", () => {
      searchParams = new URLSearchParams({
        search: "john",
      })

      const { result } = renderHook(() => useTableUrlState())

      act(() => {
        result.current.updateParams({
          search: undefined,
        })
      })

      const url = getLastNavigationUrl()

      expect(url.pathname).toBe(pathname)
      expect([...url.searchParams.entries()]).toHaveLength(0)
    })

    it("should reset page to 1 when search changes and page is not provided", () => {
      searchParams = new URLSearchParams({
        page: "5",
      })

      const { result } = renderHook(() => useTableUrlState())

      act(() => {
        result.current.updateParams({
          search: "john",
        })
      })

      const url = getLastNavigationUrl()

      expect(url.searchParams.get("page")).toBe("1")
      expect(url.searchParams.get("search")).toBe("john")
    })

    it("should reset page to 1 when perPage changes and page is not provided", () => {
      searchParams = new URLSearchParams({
        page: "5",
      })

      const { result } = renderHook(() => useTableUrlState())

      act(() => {
        result.current.updateParams({
          perPage: 100,
        })
      })

      const url = getLastNavigationUrl()

      expect(url.searchParams.get("page")).toBe("1")
      expect(url.searchParams.get("perPage")).toBe("100")
    })

    it("should not reset page when page is explicitly provided with search", () => {
      const { result } = renderHook(() => useTableUrlState())

      act(() => {
        result.current.updateParams({
          search: "john",
          page: 4,
        })
      })

      const url = getLastNavigationUrl()

      expect(url.searchParams.get("page")).toBe("4")
      expect(url.searchParams.get("search")).toBe("john")
    })

    it("should not reset page when page is explicitly provided with perPage", () => {
      const { result } = renderHook(() => useTableUrlState())

      act(() => {
        result.current.updateParams({
          perPage: 100,
          page: 3,
        })
      })

      const url = getLastNavigationUrl()

      expect(url.searchParams.get("page")).toBe("3")
      expect(url.searchParams.get("perPage")).toBe("100")
    })

    it("should navigate with scroll disabled", () => {
      const { result } = renderHook(() => useTableUrlState())

      act(() => {
        result.current.updateParams({
          page: 2,
        })
      })

      expect(replaceMock).toHaveBeenCalledTimes(1)
      expect(replaceMock.mock.calls[0]?.[1]).toEqual({
        scroll: false,
      })
    })
  })
})
