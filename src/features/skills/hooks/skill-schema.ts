import type { TFunction } from "i18next"
import { z } from "zod"

export const getSkillCatalogSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("errors.name", { ns: "input" }),
    }),
    categoryId: z.string().optional(),
  })

export const skillBaseSchema = z.object({
  mastery: z.string().min(1),
})

export const skillAddSchema = skillBaseSchema.extend({
  skillId: z.string().min(1),
})

export type AddSkillFormInput = z.infer<typeof skillAddSchema>
export type UpdateSkillFormInput = z.infer<typeof skillBaseSchema>
