"use client"

import Link from "next/link"
import { useT } from "next-i18next/client"

import { FloatingPasswordInput } from "@/components/shared/input/floating-password-input"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { paths } from "@/config/paths"
import { useResetPasswordForm } from "@/features/auth/hooks/use-reset-password-form"

export default function ResetPasswordForm() {
  const { t } = useT(["auth", "input"])
  const { register, handleSubmit, errors, isPending, state } =
    useResetPasswordForm()
  return (
    <form onSubmit={handleSubmit}>
      <h4>{t("reset-password-form.title", { ns: "auth" })}</h4>
      <p className="sub-title">
        {t("reset-password-form.text", { ns: "auth" })}
      </p>

      <FieldGroup>
        <Field>
          <FloatingPasswordInput
            label={t("password", { ns: "input" })}
            autoComplete="new-password"
            disabled={isPending}
            {...register("newPassword")}
          />
          {errors.newPassword && <FieldError errors={[errors.newPassword]} />}
        </Field>
        <Field>
          <FloatingPasswordInput
            label={t("confirm-password", { ns: "input" })}
            autoComplete="new-password"
            disabled={isPending}
            {...register("confirm-password")}
          />
          {errors["confirm-password"] && (
            <FieldError errors={[errors["confirm-password"]]} />
          )}
        </Field>
      </FieldGroup>

      {state.error && (
        <p className="mt-2 text-sm text-primary">{state.error}</p>
      )}

      <div className="button-group mt-4">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? t("button-loading", { ns: "auth" })
            : t("forgot-password-form.button", { ns: "auth" })}
        </Button>
        <Link href={paths.auth.login.get()}>
          {t("reset-password-form.button-secondary", { ns: "auth" })}
        </Link>
      </div>
    </form>
  )
}
