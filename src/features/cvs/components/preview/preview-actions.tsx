"use client"

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
      className="print:hidden"
    >
      {t("export-pdf")}
    </Button>
  )
}
