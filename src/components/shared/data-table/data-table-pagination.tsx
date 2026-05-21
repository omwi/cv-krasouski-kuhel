"use client"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import { useTableUrlState } from "@/hooks/use-table-url-state"

export type DataTablePaginationProps = {
  totalCount: number
  totalText: string
  defaultPerPage?: number
}

export function DataTablePagination({
  totalCount,
  totalText,
  defaultPerPage = 20,
}: DataTablePaginationProps) {
  const { params, updateParams } = useTableUrlState({ defaultPerPage })
  const { t } = useT("common")

  const totalPages = Math.max(1, Math.ceil(totalCount / params.perPage))
  const currentPage = params.page

  return (
    <div className="flex shrink-0 items-center justify-between py-4">
      <p className="flex-1 text-sm text-muted-foreground">{totalText}</p>
      {totalPages > 1 && (
        <div className="flex items-center gap-6 lg:gap-8">
          <p className="text-sm font-medium">
            {t("pagination.page-info", {
              current: currentPage,
              total: totalPages,
            })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 min-w-0 p-0 lg:flex"
              onClick={() => updateParams({ page: 1 })}
              disabled={currentPage <= 1}
            >
              <span className="sr-only">{t("pagination.first-page")}</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 min-w-0 p-0"
              onClick={() => updateParams({ page: currentPage - 1 })}
              disabled={currentPage <= 1}
            >
              <span className="sr-only">{t("pagination.prev-page")}</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 min-w-0 p-0"
              onClick={() => updateParams({ page: currentPage + 1 })}
              disabled={currentPage >= totalPages}
            >
              <span className="sr-only">{t("pagination.next-page")}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 min-w-0 p-0 lg:flex"
              onClick={() => updateParams({ page: totalPages })}
              disabled={currentPage >= totalPages}
            >
              <span className="sr-only">{t("pagination.last-page")}</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
