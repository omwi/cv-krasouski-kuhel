import { useState } from "react"
import { useRouter } from "next/navigation"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import type { TFunction } from "i18next"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { paths } from "@/config/paths"

export const getVerificationSchema = (t: TFunction) =>
  z.object({
    otp: z.string().length(6, t("errors.otp", { ns: "input" })),
  })

export type VerificationInput = z.infer<
  ReturnType<typeof getVerificationSchema>
>

export function useVerificationForm() {
  const router = useRouter()
  const { t } = useT(["input", "auth"])
  const [isPending, setIsPending] = useState(false)

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationInput>({
    resolver: standardSchemaResolver(getVerificationSchema(t)),
    defaultValues: { otp: "" },
  })

  const onSubmit = async (data: VerificationInput) => {
    setIsPending(true)
    try {
      const res = await fetch(API_ENDPOINTS.auth.verify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (!res.ok) {
        const message =
          json.message ?? t("errors.verify-failed", { ns: "auth" })
        toast.error(message)
        return
      }

      toast.success(t("toast.verification-success", { ns: "auth" }))
      router.push(paths.users.get())
    } catch {
      toast.error(t("errors.unexpected", { ns: "auth" }))
    } finally {
      setIsPending(false)
    }
  }

  return {
    setValue,
    watch,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isPending,
  }
}
