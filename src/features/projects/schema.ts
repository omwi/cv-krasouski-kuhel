import type { TFunction } from "i18next"
import { z } from "zod"

export const getProjectSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("errors.name", { ns: "input" }),
    }),
    domain: z.string().min(10, {
      message: t("errors.domain", { ns: "input" }),
    }),
    description: z.string().min(10, {
      message: t("errors.description", { ns: "input" }),
    }),
    environment: z.array(z.string().min(1)).min(1),
    start_date: z.string().min(2, {
      message: t("errors.description", { ns: "input" }),
    }),
    end_date: z.string().optional(),
  })

export type ProjectFormValues = z.infer<ReturnType<typeof getProjectSchema>>
