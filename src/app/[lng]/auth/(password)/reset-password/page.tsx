import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import ForgotPasswordForm from "@/features/auth/components/forgot-password-form"

import "@/features/auth/style/auth.css"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("reset-password.title"),
    description: t("reset-password.description"),
  }
}

export default function ResetPassword() {
  return <p>ede</p>
}
