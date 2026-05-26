import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import UserLanguages from "@/features/users/components/languages/user-languages"
import { GET_USER_LANGUAGES } from "@/graphql/users/queries"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("user-languages.title"),
    description: t("user-languages.description"),
  }
}

export default async function UserLanguagesPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  return (
    <PreloadQuery query={GET_USER_LANGUAGES} variables={{ userId }}>
      <UserLanguages userId={userId} />
    </PreloadQuery>
  )
}
