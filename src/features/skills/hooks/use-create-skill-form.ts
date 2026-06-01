"use client"

import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { SkillFormValues } from "@/components/shared/form/skill-form-dialog"
import { CREATE_SKILL } from "@/graphql/skills/mutations"
import { appendUniqueRef } from "@/utils/cache"

const getCreateSkillSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("errors.name", { ns: "input" }),
    }),
    categoryId: z.string().optional(),
  })

export function useCreateSkillForm(
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const { t } = useT(["skill-actions", "input", "buttons"])

  const [mutateCreate, { loading }] = useMutation(CREATE_SKILL, {
    update(cache, { data }) {
      if (data?.createSkill) {
        cache.modify({
          fields: {
            skills(existingRefs = [], { readField }) {
              const newRef = { __ref: cache.identify(data.createSkill)! }
              return appendUniqueRef(newRef, data.createSkill.id)(
                existingRefs,
                {
                  readField,
                }
              )
            },
          },
        })
      }
    },
  })

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(getCreateSkillSchema(t)),
    defaultValues: {
      name: "",
      categoryId: "none",
    },
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    if (open) {
      reset({ name: "", categoryId: "none" })
    }
  }, [open, reset])

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateCreate({
        variables: {
          skill: {
            name: data.name,
            ...(data.categoryId && data.categoryId !== "none"
              ? { categoryId: data.categoryId }
              : {}),
          },
        },
      })
      toast.success(t("create.success", { ns: "skill-actions" }))
      setOpen(false)
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("create.error", { ns: "skill-actions" })
      toast.error(errorMessage)
    }
  })

  return {
    form,
    onSubmit,
    loading,
  }
}
