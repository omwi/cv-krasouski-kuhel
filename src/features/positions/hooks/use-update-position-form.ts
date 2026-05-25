"use client"

import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { TablePosition } from "@/features/positions/components/table/positions-table-columns"
import { UPDATE_POSITION } from "@/graphql/positions/mutations"
import { GET_POSITIONS } from "@/graphql/positions/queries"

const getUpdatePositionSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("errors.name", { ns: "input" }),
    }),
  })

export type UpdatePositionFormValues = {
  name: string
}

export function useUpdatePositionForm(
  position: TablePosition,
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const { t } = useT(["position", "input", "buttons"])

  const [mutateUpdate, { loading }] = useMutation(UPDATE_POSITION, {
    refetchQueries: [{ query: GET_POSITIONS }],
  })

  const form = useForm<UpdatePositionFormValues>({
    resolver: zodResolver(getUpdatePositionSchema(t)),
    defaultValues: {
      name: position.name || "",
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form

  useEffect(() => {
    if (open) {
      reset({ name: position.name || "" })
    }
  }, [open, position, reset])

  const onSubmit = handleSubmit(async (data) => {
    if (!isDirty) {
      toast.info(t("update.no-changes", { ns: "position" }))
      setOpen(false)
      return
    }

    try {
      await mutateUpdate({
        variables: {
          position: {
            positionId: String(position.id),
            name: data.name,
          },
        },
      })
      toast.success(t("update.success", { ns: "position" }))
      setOpen(false)
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("update.error", { ns: "position" })
      toast.error(errorMessage)
    }
  })

  return {
    ...form,
    onSubmit,
    loading,
  }
}
