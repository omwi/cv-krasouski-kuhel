import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import "@/features/auth/style/auth.css"

import ResetPasswordForm from "@/features/auth/components/reset-password-form"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("reset-password.title"),
    description: t("reset-password.description"),
  }
}

export default function ResetPassword() {
  return <ResetPasswordForm />
}
