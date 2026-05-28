import "@/features/auth/style/auth.css"

import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import VerificationForm from "@/features/auth/components/verification-form"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("signup.title"),
    description: t("signup.description"),
  }
}

export default function Verification() {
  return (
    <section className="auth-container flex h-dvh w-full items-center justify-center">
      <VerificationForm />
    </section>
  )
}
