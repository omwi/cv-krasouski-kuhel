"use client"

import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"

export default function SignupForm() {
  const { t } = useT("auth")

  return (
    <form action="">
      <h4>{t("signup_form.form_title")}</h4>
      <p className="sub-title">{t("signup_form.form_text")}</p>
      <FieldGroup>
        <Field>
          <FloatingInput label={t("signup_form.email_label")} />
        </Field>
        <Field>
          <FloatingInput label={t("signup_form.password_label")} />
        </Field>
      </FieldGroup>
      <div className="button-group">
        <Button>{t("signup_form.sign_button")}</Button>
        <Button variant="ghost">{t("signup_form.secondary_button")}</Button>
      </div>
    </form>
  )
}
