import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm"

import "@/features/auth/style/auth.css"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("forgot-password.title"),
    description: t("forgot-password.description"),
  }
}

export default function ForgotPassword() {
  return <ForgotPasswordForm />
}
