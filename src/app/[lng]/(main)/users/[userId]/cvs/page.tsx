import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import UserCvsTableDataWrapper from "@/features/users/components/cvs/user-cvs-table-data-wrapper"
import { GET_USER_CVS } from "@/graphql/users/queries"
import { getCurrentUser } from "@/utils/get-current-user"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("user-cvs.title"),
    description: t("user-cvs.description"),
  }
}

export default async function UserCvsPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const [{ userId }, currentUser] = await Promise.all([
    params,
    getCurrentUser(),
  ])

  return (
    <PreloadQuery query={GET_USER_CVS} variables={{ userId }}>
      <UserCvsTableDataWrapper currentUser={currentUser} userId={userId} />
    </PreloadQuery>
  )
}
