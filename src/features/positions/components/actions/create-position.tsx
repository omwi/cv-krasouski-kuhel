"use client"

import { ReactNode, useState } from "react"
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
import { CREATE_POSITION } from "@/graphql/positions/mutations"
import { GET_POSITIONS } from "@/graphql/positions/queries"

export type CreatePositionProps = {
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const getCreatePositionSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("input:errors.name"),
    }),
  })

type CreatePositionFormValues = {
  name: string
}

export default function CreatePosition({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CreatePositionProps) {
  const { t } = useT(["position", "input", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen

  const [mutateCreate, { loading }] = useMutation(CREATE_POSITION, {
    refetchQueries: [{ query: GET_POSITIONS }],
  })

  const form = useForm<CreatePositionFormValues>({
    resolver: zodResolver(getCreatePositionSchema(t)),
    defaultValues: {
      name: "",
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = form

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
      reset()
      setOpen(false)
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : t("position:create.error")
      toast.error(errorMessage)
    }
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          reset()
        }
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("position:create.title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="grid grid-cols-1">
            <Field>
              <FloatingInput
                id="name"
                label={t("input:name")}
                disabled={loading || isSubmitting}
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
              disabled={!isValid || loading || isSubmitting}
            >
              {t("buttons:create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
