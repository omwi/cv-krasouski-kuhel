"use client"

import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"

export default function PreviewActions() {
  const { t } = useT("buttons")

  const handleClick = () => {
    console.log("Export PDF")
  }

  return (
    <div className="flex flex-row justify-end">
      <Button variant={"outline-primary"} onClick={handleClick}>
        {t("export-pdf")}
      </Button>
    </div>
  )
}
