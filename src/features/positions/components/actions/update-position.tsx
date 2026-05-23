"use client"

import { ReactNode, useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import { TablePosition } from "@/features/positions/components/table/positions-table-columns"
import { UPDATE_POSITION } from "@/graphql/positions/mutations"
import { GET_POSITIONS } from "@/graphql/positions/queries"

export type UpdatePositionProps = {
  position: TablePosition
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const getUpdatePositionSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("input:errors.name"),
    }),
  })

type UpdatePositionFormValues = {
  name: string
}

export default function UpdatePosition({
  position,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: UpdatePositionProps) {
  const { t } = useT(["position", "input", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen

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
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = form

  useEffect(() => {
    if (open) {
      reset({ name: position.name || "" })
    }
  }, [open, position, reset])

  const onSubmit = handleSubmit(async (data) => {
    if (!isDirty) {
      toast.info(t("position:update.no-changes"))
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
      toast.success(t("position:update.success"))
      setOpen(false)
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : t("position:update.error")
      toast.error(errorMessage)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("position:update.title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="grid grid-cols-1">
            <Field>
              <FloatingInput
                id="name"
                label={t("input:name")}
                {...register("name")}
              />
              {errors.name && (
                <FieldError className="mt-1">{errors.name.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={loading || isSubmitting}
              >
                {t("buttons:cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!isDirty || loading || isSubmitting}
            >
              {t("buttons:update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
