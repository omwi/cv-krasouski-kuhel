"use client"

import Link from "next/link"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { paths } from "@/config/paths"

import { useForgotPasswordForm } from "../hooks/use-forgot-password-form"

export default function ForgotPasswordForm() {
  const { t } = useT(["auth", "input"])
  const { register, handleSubmit, errors, isPending } = useForgotPasswordForm()

  return (
    <form onSubmit={handleSubmit}>
      <h4>{t("auth:forgot-password-form.title")}</h4>
      <p className="sub-title">{t("auth:forgot-password-form.text")}</p>

      <FieldGroup>
        <Field>
          <FloatingInput
            autoFocus
            autoComplete="email"
            type="email"
            label={t("input:email")}
            disabled={isPending}
            {...register("email")}
          />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>
      </FieldGroup>
      <div className="button-group mt-4">
        <Button disabled={isPending} type="submit">
          {isPending
            ? t("auth:button-loading")
            : t("auth:forgot-password-form.button")}
        </Button>

        <Link href={paths.auth.login.get()}>
          {t("auth:forgot-password-form.button-secondary")}
        </Link>
      </div>
    </form>
  )
}
