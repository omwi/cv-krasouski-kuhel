import "@/features/auth/style/auth.css"

import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getT } from "next-i18next/server"

import { getClient } from "@/apollo-client"
import { paths } from "@/config/paths"
import VerificationForm from "@/features/auth/components/verification-form"
import { GET_USER } from "@/graphql/users/queries"
import { getCurrentUser } from "@/utils/get-current-user"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("verify.title"),
    description: t("verify.description"),
  }
}

export default async function Verification() {
  const currentUser = await getCurrentUser()

  if (currentUser) {
    try {
      const client = getClient()
      const { data } = await client.query({
        query: GET_USER,
        variables: { userId: currentUser.id },
      })
      if (data?.user?.is_verified) {
        redirect(paths.users.get())
      }
    } catch (error) {
      console.error("Error checking user verification status on server:", error)
    }
  }

  return (
    <section className="auth-container flex h-dvh w-full items-center justify-center">
      <VerificationForm />
    </section>
  )
}
