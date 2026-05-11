import { getT } from "next-i18next/server"
import { Button } from "@/components/ui/button"

export default async function Page() {
  const { t } = await getT()

  return (
    <div className="p-6 flex min-h-svh">
      <div className="max-w-md min-w-0 gap-4 text-sm leading-loose flex flex-col">
        <div>
          <h1 className="font-medium">{t("title")}</h1>
          <p>{t("description")}</p>
          <p>{t("button_desc")}</p>
          <Button className="mt-2">{t("button")}</Button>
        </div>
        <div
          className="font-mono text-xs text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: t("theme_toggle") }}
        />
      </div>
    </div>
  )
}
