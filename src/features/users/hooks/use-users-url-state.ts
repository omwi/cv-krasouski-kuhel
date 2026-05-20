import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export type SortOrder = "asc" | "desc"

export type UsersUrlParams = {
  page: number
  perPage: number
  search: string
  sortBy: string
  sortOrder: SortOrder
}

export function useUsersUrlState() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params: UsersUrlParams = useMemo(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      perPage: Number(searchParams.get("perPage")) || 20,
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sortBy") || "firstName",
      sortOrder:
        (searchParams.get("sortOrder") as SortOrder) === "asc" ? "asc" : "desc",
    }
  }, [searchParams])

  const updateParams = (newParams: Partial<UsersUrlParams>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

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
