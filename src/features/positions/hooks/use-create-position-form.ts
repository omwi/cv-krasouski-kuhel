"use client"

import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { CREATE_POSITION } from "@/graphql/positions/mutations"
import { GET_POSITIONS } from "@/graphql/positions/queries"

const getCreatePositionSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("input:errors.name"),
    }),
  })

export type CreatePositionFormValues = {
  name: string
}

export function useCreatePositionForm(
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const { t } = useT(["position", "input", "buttons"])

  const [mutateCreate, { loading }] = useMutation(CREATE_POSITION, {
    refetchQueries: [{ query: GET_POSITIONS }],
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
      toast.success(t("position:create.success"))
      setOpen(false)
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : t("position:create.error")
      toast.error(errorMessage)
    }
  })

  return {
    ...form,
    onSubmit,
    loading,
  }
}
