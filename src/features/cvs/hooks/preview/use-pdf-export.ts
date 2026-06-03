import { useMutation } from "@apollo/client/react"
import { useT } from "next-i18next/client"
import { toast } from "sonner"

import { buildPdfHtml, downloadPdf } from "@/features/cvs/utils/pdf-export"
import { EXPORT_PDF } from "@/graphql/cvs/mutations"

export function usePdfExport(fileName: string) {
  const { t } = useT("cv-preview")

  const [exportPdf, { loading }] = useMutation(EXPORT_PDF)

  const handleClick = async () => {
    try {
      const cvPreview = document.getElementById("cv-preview")
      if (!cvPreview) {
        return
      }
      const html = buildPdfHtml(cvPreview)

      const { data } = await exportPdf({
        variables: {
          pdf: {
            html,
            margin: {
              bottom: "15mm",
              left: "12mm",
              right: "12mm",
              top: "15mm",
            },
          },
        },
      })
      if (!data?.exportPdf) {
        throw new Error("No data in response")
      }

      downloadPdf(fileName, data.exportPdf)
    } catch (error) {
      console.error(error)
      toast.error(t("export.error"))
    }
  }

  return { onClick: handleClick, loading }
}
