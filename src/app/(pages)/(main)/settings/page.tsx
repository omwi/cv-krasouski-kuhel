import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { getLanguageCookie } from "@/features/settings/actions"
import SettingsForm from "@/features/settings/components/settings-form"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("settings.title"),
    description: t("settings.description"),
  }
}

export default async function Settings() {
  const initialLang = await getLanguageCookie()

  return (
    <div className="flex flex-1 flex-col pt-4">
      <SettingsForm initialLang={initialLang} />
    </div>
  )
}
