"use client"

import Link from "next/link"
import { useT } from "next-i18next/client"

import { FloatingPasswordInput } from "@/components/shared/input/floating-password-input"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { paths } from "@/config/paths"
import { useSignupForm } from "@/features/auth/hooks/use-signup-form"

export default function SignupForm() {
  const { t } = useT(["auth", "input"])
  const { register, handleSubmit, errors, isPending } = useSignupForm()

  return (
    <form onSubmit={handleSubmit}>
      <h4>{t("signup-form.title", { ns: "auth" })}</h4>
      <p className="sub-title">{t("signup-form.text", { ns: "auth" })}</p>

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
        <Field>
          <FloatingPasswordInput
            autoComplete="new-password"
            label={t("password", { ns: "input" })}
            disabled={isPending}
            {...register("password")}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>
      </FieldGroup>
      <div className="button-group mt-4">
        <Button disabled={isPending} type="submit">
          {isPending
            ? t("button-loading", { ns: "auth" })
            : t("signup-form.button", { ns: "auth" })}
        </Button>
        <Link href={paths.auth.login.get()}>
          {t("signup-form.button-secondary", { ns: "auth" })}
        </Link>
      </div>
    </form>
  )
}
