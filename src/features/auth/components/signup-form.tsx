"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { paths } from "@/config/paths"

import { useSignupForm } from "../hooks/use-signup-form"

export default function SignupForm() {
  const { t } = useT("auth")
  const { register, handleSubmit, errors, isPending } = useSignupForm()
  const [showPassword, setShowPassword] = useState(false)

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
            disabled={isPending}
            {...register("email")}
          />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>
        <Field>
          <div className="relative">
            <FloatingInput
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              label={t("label.password")}
              disabled={isPending}
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground focus:outline-hidden"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>
      </FieldGroup>
      <div className="button-group mt-4">
        <Button disabled={isPending} type="submit">
          {isPending
            ? t("signup-form.button-loading")
            : t("signup-form.button")}
        </Button>
        <Link href={paths.auth.login.get()}>
          {t("signup-form.button-secondary")}
        </Link>
      </div>
    </form>
  )
}
