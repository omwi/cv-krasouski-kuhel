import { getT } from "next-i18next/server"

import { Button } from "@/components/ui/button"

export default async function Page() {
  const { t } = await getT()

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">{t("title")}</h1>
          <p>{t("description")}</p>
          <p>{t("button_desc")}</p>
          <Button className="mt-2">{t("button")}</Button>
        </div>
      </div>
    </div>
  )
}
