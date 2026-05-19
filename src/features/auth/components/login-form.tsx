"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { paths } from "@/config/paths"

import { useLoginForm } from "../hooks/use-login-form"

export default function LoginForm() {
  const { t } = useT("auth")
  const { register, handleSubmit, errors, isPending } = useLoginForm()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={handleSubmit}>
      <h4>{t("login-form.title")}</h4>
      <p className="sub-title">{t("login-form.text")}</p>

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
              autoComplete="current-password"
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
          {isPending ? t("login-form.button-loading") : t("login-form.button")}
        </Button>
        <Link href={paths.auth.forgotPassword.get()}>
          {t("login-form.button-secondary")}
        </Link>
      </div>
    </form>
  )
}
