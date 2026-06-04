import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useProcessedData } from "./use-processed-data"

type TestRow = {
  id: number
  name: string | null
  age: number | null
  city?: string
}

const data: TestRow[] = [
  { id: 1, name: "Charlie", age: 30, city: "Boston" },
  { id: 2, name: "Alice", age: 20, city: "Atlanta" },
  { id: 3, name: "Bob", age: 25, city: "Chicago" },
]

const baseParams = {
  search: "",
  sortBy: "",
  sortOrder: "asc" as const,
  page: 1,
  perPage: 10,
}

describe("useProcessedData", () => {
  it("should return all rows when no search term is provided", () => {
    const columns = [
      {
        id: "name",
        titleKey: "Name",
        searchable: true,
        sortable: true,
      },
    ]

    const { result } = renderHook(() =>
      useProcessedData({
        data,
        params: baseParams,
        columns,
      })
    )

    expect(result.current.totalCount).toBe(3)
    expect(result.current.paginatedData).toEqual(data)
  })

  it("should filter rows using searchable columns only and support accessorFn", () => {
    const columns = [
      {
        id: "name",
        titleKey: "Name",
        searchable: false,
        sortable: true,
      },
      {
        id: "city",
        titleKey: "City",
        searchable: true,
        sortable: false,
        accessorFn: (row: TestRow) => row.city,
      },
    ]

    const { result } = renderHook(() =>
      useProcessedData({
        data,
        params: {
          ...baseParams,
          search: "atl",
        },
        columns,
      })
    )

    expect(result.current.totalCount).toBe(1)
    expect(result.current.paginatedData).toEqual([data[1]])
  })

  describe.each([
    {
      sortOrder: "asc" as const,
      expectedIds: [2, 3, 1],
    },
    {
      sortOrder: "desc" as const,
      expectedIds: [1, 3, 2],
    },
  ])("numeric sorting ($sortOrder)", ({ sortOrder, expectedIds }) => {
    it("should sort numeric values correctly", () => {
      const columns = [
        {
          id: "age",
          titleKey: "Age",
          sortable: true,
          searchable: true,
        },
      ]

      const { result } = renderHook(() =>
        useProcessedData({
          data,
          params: {
            ...baseParams,
            sortBy: "age",
            sortOrder,
          },
          columns,
        })
      )

      expect(result.current.paginatedData.map((row) => row.id)).toEqual(
        expectedIds
      )
    })
  })

  it("should sort string values alphabetically", () => {
    const columns = [
      {
        id: "name",
        titleKey: "Name",
        sortable: true,
        searchable: true,
      },
    ]

    const { result } = renderHook(() =>
      useProcessedData({
        data,
        params: {
          ...baseParams,
          sortBy: "name",
          sortOrder: "asc",
        },
        columns,
      })
    )

    expect(result.current.paginatedData.map((row) => row.name)).toEqual([
      "Alice",
      "Bob",
      "Charlie",
    ])
  })

  it("should not sort when the selected column is not sortable", () => {
    const columns = [
      {
        id: "name",
        titleKey: "Name",
        sortable: false,
        searchable: true,
      },
    ]

    const { result } = renderHook(() =>
      useProcessedData({
        data,
        params: {
          ...baseParams,
          sortBy: "name",
        },
        columns,
      })
    )

    expect(result.current.paginatedData).toEqual(data)
  })

  it("should hoist matching rows to the beginning", () => {
    const columns = [
      {
        id: "name",
        titleKey: "Name",
        sortable: false,
        searchable: true,
      },
    ]

    const { result } = renderHook(() =>
      useProcessedData({
        data,
        params: baseParams,
        columns,
        hoistPredicate: (row) => row.id === 3,
      })
    )

    expect(result.current.paginatedData.map((row) => row.id)).toEqual([3, 1, 2])
  })

  it("should return the correct page and total count", () => {
    const columns = [
      {
        id: "name",
        titleKey: "Name",
        sortable: false,
        searchable: true,
      },
    ]

    const { result } = renderHook(() =>
      useProcessedData({
        data,
        params: {
          ...baseParams,
          page: 2,
          perPage: 2,
        },
        columns,
      })
    )

    expect(result.current.totalCount).toBe(3)
    expect(result.current.paginatedData).toEqual([data[2]])
  })

  it("should return empty results when data is empty", () => {
    const columns = [
      {
        id: "name",
        titleKey: "Name",
        sortable: true,
        searchable: true,
      },
    ]

    const { result } = renderHook(() =>
      useProcessedData({
        data: [],
        params: baseParams,
        columns,
      })
    )

    expect(result.current).toEqual({
      paginatedData: [],
      totalCount: 0,
    })
  })

  it("should ignore null and undefined values during search and sorting", () => {
    const nullableData: TestRow[] = [
      { id: 1, name: null, age: null },
      { id: 2, name: "Alice", age: 20 },
    ]

    const columns = [
      {
        id: "name",
        titleKey: "Name",
        searchable: true,
        sortable: true,
      },
    ]

    const { result } = renderHook(() =>
      useProcessedData({
        data: nullableData,
        params: {
          ...baseParams,
          search: "alice",
          sortBy: "name",
        },
        columns,
      })
    )

    expect(result.current.totalCount).toBe(1)
    expect(result.current.paginatedData).toEqual([nullableData[1]])
  })
})
