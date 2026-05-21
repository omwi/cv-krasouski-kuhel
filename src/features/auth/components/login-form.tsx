"use client"

import Link from "next/link"
import { useT } from "next-i18next/client"

import { FloatingPasswordInput } from "@/components/shared/input/floating-password-input"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { paths } from "@/config/paths"

import { useLoginForm } from "../hooks/use-login-form"

export default function LoginForm() {
  const { t } = useT(["auth", "input"])
  const { register, handleSubmit, errors, isPending } = useLoginForm()

  return (
    <form onSubmit={handleSubmit}>
      <h4>{t("auth:login-form.title")}</h4>
      <p className="sub-title">{t("auth:login-form.text")}</p>

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
        <Field>
          <FloatingPasswordInput
            autoComplete="current-password"
            label={t("input:password")}
            disabled={isPending}
            {...register("password")}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>
      </FieldGroup>
      <div className="button-group mt-4">
        <Button disabled={isPending} type="submit">
          {isPending ? t("auth:button-loading") : t("auth:login-form.button")}
        </Button>
        <Link href={paths.auth.forgotPassword.get()}>
          {t("auth:login-form.button-secondary")}
        </Link>
      </div>
    </form>
  )
}
