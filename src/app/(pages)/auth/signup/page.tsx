import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import SignupForm from "@/features/auth/components/signup-form"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("signup.title"),
    description: t("signup.description"),
  }
}

export default function Signup() {
  return <SignupForm />
}
