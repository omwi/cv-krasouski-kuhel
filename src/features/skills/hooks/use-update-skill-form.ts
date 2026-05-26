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
import { TableSkill } from "@/features/skills/components/table/skills-table-columns"
import { UPDATE_SKILL } from "@/graphql/skills/mutations"
import { GET_SKILLS } from "@/graphql/skills/queries"

const getUpdateSkillSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("errors.name", { ns: "input" }),
    }),
    categoryId: z.string().optional(),
  })

export function useUpdateSkillForm(
  skill: TableSkill,
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const { t } = useT(["skill-actions", "input", "buttons"])

  const [mutateUpdate, { loading }] = useMutation(UPDATE_SKILL, {
    refetchQueries: [{ query: GET_SKILLS }],
  })

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(getUpdateSkillSchema(t)),
    defaultValues: {
      name: skill.name,
      categoryId: skill.category?.id || "none",
    },
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    if (open) {
      reset({
        name: skill.name,
        categoryId: skill.category?.id || "none",
      })
    }
  }, [open, skill, reset])

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateUpdate({
        variables: {
          skill: {
            skillId: skill.id,
            name: data.name,
            ...(data.categoryId && data.categoryId !== "none"
              ? { categoryId: data.categoryId }
              : { categoryId: null }),
          },
        },
      })
      toast.success(t("update.success", { ns: "skill-actions" }))
      setOpen(false)
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("update.error", { ns: "skill-actions" })
      toast.error(errorMessage)
    }
  })

  return {
    form,
    onSubmit,
    loading,
  }
}
