"use client"

import Link from "next/link"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { paths } from "@/config/paths"
import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password-form"

export default function VerificationForm() {
  const { t } = useT(["auth", "input"])
  const { register, handleSubmit, errors, isPending } = useForgotPasswordForm()

  return (
    <form onSubmit={handleSubmit}>
      <h4>{t("verification-form.title", { ns: "auth" })}</h4>
      <p className="text-secondary-foreground">
        Check your email and provide verification code
      </p>

      <Field className="my-10 w-fit">
        <FieldLabel className="text-secondary-foreground" htmlFor="digits-only">
          Digits Only
        </FieldLabel>
        <InputOTP
          className=""
          id="digits-only"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>

      <div className="button-group">
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
