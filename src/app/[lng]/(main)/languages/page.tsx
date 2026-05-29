import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import LanguagesTable from "@/features/languages/components/table/languages-table"
import { GET_LANGUAGES } from "@/graphql/languages/queries"
import { getCurrentUser } from "@/utils/get-current-user"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("languages.title"),
    description: t("languages.description"),
  }
}

export default async function Departments() {
  const currentUser = await getCurrentUser()

  return (
    <PreloadQuery query={GET_LANGUAGES}>
      <LanguagesTable currentUser={currentUser} />
    </PreloadQuery>
  )
}
