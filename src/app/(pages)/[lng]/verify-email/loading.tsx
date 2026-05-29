import { useT } from "next-i18next/client"

export default function Loading() {
  const { t } = useT("auth")

  return (
    <div className="flex min-h-75 flex-col items-center justify-center p-8">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <span className="animate-pulse text-sm text-secondary-foreground">
        {t("button-loading")}
      </span>
    </div>
  )
}
