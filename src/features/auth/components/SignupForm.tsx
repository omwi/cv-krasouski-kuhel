"use client"

import Link from "next/link"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"

import { useSignupForm } from "../hooks/useSignupForm"

export default function SignupForm() {
  const { t } = useT("auth")

  const { register, handleSubmit, errors, isSubmitting, loading } =
    useSignupForm()

  return (
    <form onSubmit={handleSubmit}>
      <h4>{t("signup-form.title")}</h4>
      <p className="sub-title">{t("signup-form.text")}</p>

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
        <Field>
          <FloatingInput
            autoComplete="new-password"
            type="password"
            label={t("label.password")}
            disabled={isSubmitting || loading}
            {...register("password")}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>
      </FieldGroup>
      <div className="button-group mt-4">
        <Button disabled={isSubmitting || loading} type="submit">
          {loading ? t("signup-form.button-loading") : t("signup-form.button")}
        </Button>
        <Link href="/auth/login">{t("signup-form.button-secondary")}</Link>
      </div>
    </form>
  )
}
