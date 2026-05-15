"use client"

import Link from "next/link"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"

import { useForgotPasswordForm } from "../hooks/UseForgotPasswordForm"

export default function ForgotPasswordForm() {
  const { t } = useT("auth")
  const { register, handleSubmit, errors, isSubmitting, loading } =
    useForgotPasswordForm()

  return (
    <form onSubmit={handleSubmit}>
      <h4>{t("forgot-password-form.title")}</h4>
      <p className="sub-title">{t("forgot-password-form.text")}</p>

      <FieldGroup>
        <Field>
          <FloatingInput
            autoFocus
            autoComplete="email"
            type="email"
            label={t("label.email")}
            disabled={isSubmitting || loading}
            {...register("email")}
          />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>
      </FieldGroup>
      <div className="button-group mt-4">
        <Button disabled={isSubmitting || loading} type="submit">
          {loading
            ? t("forgot-password-form.button-loading")
            : t("forgot-password-form.button")}
        </Button>

        <Link href="/auth/login">
          {t("forgot-password-form.button-secondary")}
        </Link>
      </div>
    </form>
  )
}
