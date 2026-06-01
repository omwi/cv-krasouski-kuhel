"use client"

import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { POSITION_FIELDS_FRAGMENT } from "@/graphql/positions/fragments"
import { CREATE_POSITION } from "@/graphql/positions/mutations"
import { appendUniqueRef } from "@/utils/cache"

const getCreatePositionSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("errors.name", { ns: "input" }),
    }),
  })

export type CreatePositionFormValues = {
  name: string
}

export function useCreatePositionForm(
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const { t } = useT(["position-actions", "input", "buttons"])

  const [mutateCreate, { loading }] = useMutation(CREATE_POSITION, {
    update(cache, { data }) {
      const newPosition = data?.createPosition
      if (!newPosition) return

      const newRef = cache.writeFragment({
        data: newPosition,
        fragment: POSITION_FIELDS_FRAGMENT,
      })
      if (!newRef) return

      cache.modify({
        fields: {
          positions: appendUniqueRef(newRef, newPosition.id),
        },
      })
    },
  })

  const form = useForm<CreatePositionFormValues>({
    resolver: zodResolver(getCreatePositionSchema(t)),
    defaultValues: {
      name: "",
    },
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    if (open) {
      reset({ name: "" })
    }
  }, [open, reset])

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateCreate({
        variables: {
          position: {
            name: data.name,
          },
        },
      })
      toast.success(t("create.success", { ns: "position-actions" }))
      setOpen(false)
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("create.error", { ns: "position-actions" })
      toast.error(errorMessage)
    }
  })

  return {
    form,
    onSubmit,
    loading,
  }
}
