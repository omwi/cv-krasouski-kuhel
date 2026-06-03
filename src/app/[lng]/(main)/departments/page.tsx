import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import DepartmentsTable from "@/features/departments/components/table/departments-table"
import { GET_DEPARTMENTS } from "@/graphql/departments/queries"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("departments.title"),
    description: t("departments.description"),
  }
}

export default async function Departments() {
  return (
    <PreloadQuery query={GET_DEPARTMENTS}>
      <DepartmentsTable />
    </PreloadQuery>
  )
}
