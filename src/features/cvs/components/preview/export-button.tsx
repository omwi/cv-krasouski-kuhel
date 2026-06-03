"use client"

import { FileUser } from "lucide-react"
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
    >
      <FileUser />
      {t("export-pdf")}
    </Button>
  )
}
