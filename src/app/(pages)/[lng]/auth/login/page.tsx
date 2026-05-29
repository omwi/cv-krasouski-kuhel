import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import LoginForm from "@/features/auth/components/login-form"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("login.title"),
    description: t("login.description"),
  }
}

export default function Login() {
  return <LoginForm />
}
