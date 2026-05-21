import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export type SortOrder = "asc" | "desc"

export type TableUrlParams = {
  page: number
  perPage: number
  search: string
  sortBy: string
  sortOrder: SortOrder
}

type UseTableUrlStateOptions = {
  defaultSortBy?: string
  defaultSortOrder?: SortOrder
  defaultPerPage?: number
}

export function useTableUrlState(options: UseTableUrlStateOptions = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const {
    defaultSortBy = "id",
    defaultSortOrder = "desc",
    defaultPerPage = 20,
  } = options

  const params: TableUrlParams = useMemo(() => {
    const querySortOrder = searchParams.get("sortOrder")
    return {
      page: Number(searchParams.get("page")) || 1,
      perPage: Number(searchParams.get("perPage")) || defaultPerPage,
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sortBy") || defaultSortBy,
      sortOrder:
        querySortOrder === "asc" || querySortOrder === "desc"
          ? querySortOrder
          : defaultSortOrder,
    }
  }, [searchParams, defaultSortBy, defaultSortOrder, defaultPerPage])

  const updateParams = (newParams: Partial<TableUrlParams>) => {
    const current = new URLSearchParams(searchParams.toString())

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        current.delete(key)
      } else {
        current.set(key, String(value))
      }
    })

    if (
      (newParams.search !== undefined || newParams.perPage !== undefined) &&
      newParams.page === undefined
    ) {
      current.set("page", "1")
    }

    const search = current.toString()
    const query = search ? `?${search}` : ""

    router.replace(`${pathname}${query}`, { scroll: false })
  }

  return { params, updateParams }
}
