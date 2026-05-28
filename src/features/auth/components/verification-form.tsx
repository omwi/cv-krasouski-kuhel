"use client"

import Link from "next/link"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { paths } from "@/config/paths"
import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password-form"

export default function VerificationForm() {
  const { t } = useT(["auth", "input"])
  const { register, handleSubmit, errors, isPending } = useForgotPasswordForm()

  return (
    <form onSubmit={handleSubmit}>
      <h4>{t("verification-form.title", { ns: "auth" })}</h4>

      <FieldGroup>
        <Field>
          <FloatingInput
            autoFocus
            autoComplete="email"
            type="email"
            label={t("email", { ns: "input" })}
            disabled={isPending}
            {...register("email")}
          />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>
      </FieldGroup>
      <div className="button-group mt-4">
        <Button disabled={isPending} type="submit">
          {isPending
            ? t("button-loading", { ns: "auth" })
            : t("verification-form.button", { ns: "auth" })}
        </Button>

        <Link href={paths.users.get()}>
          {t("verification-form.button-secondary", { ns: "auth" })}
        </Link>
      </div>
    </form>
  )
}
