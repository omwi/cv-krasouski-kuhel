import type { Metadata } from "next"
import { cookies } from "next/headers"
import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import { COOKIES } from "@/config/const"
import { decodeJwtPayload } from "@/features/auth/utils/jwt"
import UsersTable from "@/features/users/components/users-table"
import { GET_USERS_LIST } from "@/features/users/graphql/queries"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("users.title"),
    description: t("users.description"),
  }
}

export type CurrentUser = {
  id: string
  role?: string
} | null

export default async function Users() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIES.ACCESS_TOKEN)?.value
  let currentUser: CurrentUser = null

  if (token) {
    const payload = decodeJwtPayload(token)
    if (payload && payload.sub) {
      currentUser = { id: String(payload.sub), role: payload.role }
    }
  }

  return (
    <PreloadQuery query={GET_USERS_LIST}>
      <UsersTable CurrentUser={currentUser} />
    </PreloadQuery>
  )
}
