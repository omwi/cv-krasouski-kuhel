"use client"

import { useEffect } from "react"
import Link from "next/link"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useT } from "next-i18next/client"
import { toast } from "sonner"

import Loading from "@/app/[lng]/verify-email/loading"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { paths } from "@/config/paths"
import { useGetMeQuery } from "@/features/auth/hooks/use-get-me"
import { useVerificationForm } from "@/features/auth/hooks/use-verification-form"

export default function VerificationForm() {
  const { t } = useT(["auth", "input"])
  const { setValue, watch, handleSubmit, errors, isPending } =
    useVerificationForm()
  const { loading } = useGetMeQuery()

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("signup_success") === "true"
    ) {
      toast.success(t("toast.verify-email", { ns: "auth" }))
      sessionStorage.removeItem("signup_success")
    }
  }, [t])

  if (loading) {
    return <Loading />
  }

  const otpValue = watch("otp") || ""

  return (
    <form onSubmit={handleSubmit}>
      <h4>{t("verification-form.title", { ns: "auth" })}</h4>
      <p className="text-secondary-foreground">
        {t("verification-form.description", { ns: "auth" })}
      </p>

      <Field className="my-10 w-fit">
        <FieldLabel className="text-secondary-foreground" htmlFor="digits-only">
          {t("verification-form.label", { ns: "auth" })}
        </FieldLabel>
        <InputOTP
          id="digits-only"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otpValue}
          onChange={(val) => setValue("otp", val)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {errors.otp && (
          <FieldError className="mt-2">{errors.otp.message}</FieldError>
        )}
      </Field>

      <div className="button-group">
        <Button disabled={isPending || otpValue.length !== 6} type="submit">
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
