import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import LanguagesTable from "@/features/languages/components/table/languages-table"
import { GET_LANGUAGES } from "@/graphql/languages/queries"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("languages.title"),
    description: t("languages.description"),
  }
}

export default async function Departments() {
  return (
    <PreloadQuery query={GET_LANGUAGES}>
      <LanguagesTable />
    </PreloadQuery>
  )
}
