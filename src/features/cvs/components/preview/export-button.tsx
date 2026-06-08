"use client"

import { FileUser, Loader2 } from "lucide-react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import { usePdfExport } from "@/features/cvs/hooks/preview/use-pdf-export"

export default function ExportButton({
  exportFileName,
}: {
  exportFileName: string
}) {
  const { t } = useT("buttons")

  const { onClick, loading } = usePdfExport(exportFileName)

  return (
    <Button
      variant={"outline-primary"}
      disabled={loading}
      onClick={onClick}
      className="flex flex-row gap-2 print:hidden"
      data-testid="export-pdf-button"
    >
      {loading ? (
        <Loader2 className="size-5 animate-spin text-primary" />
      ) : (
        <FileUser className="size-5" />
      )}

      {t("export-pdf")}
    </Button>
  )
}
