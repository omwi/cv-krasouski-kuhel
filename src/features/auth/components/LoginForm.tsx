"use client"

import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"

export default function LoginForm() {
  const { t } = useT("auth")

  return (
    <form action="">
      <h4>{t("login_form.form_title")}</h4>
      <p className="sub-title">{t("login_form.form_text")}</p>
      <FieldGroup>
        <Field>
          <FloatingInput label={t("login_form.email_label")} />
        </Field>
        <Field>
          <FloatingInput label={t("login_form.password_label")} />
        </Field>
      </FieldGroup>
      <div className="button-group">
        <Button>{t("login_form.login_button")}</Button>
        <Button variant="ghost">{t("login_form.secondary_button")}</Button>
      </div>
    </form>
  )
}
