import type { TFunction } from "i18next"
import { z } from "zod"

export const getProjectSchema = (t: TFunction) =>
  z
    .object({
      name: z.string().min(1, {
        message: t("errors.name", { ns: "input" }),
      }),
      domain: z.string().min(1, {
        message: t("errors.domain", { ns: "input" }),
      }),
      description: z.string().min(10, {
        message: t("errors.description", { ns: "input" }),
      }),
      environment: z.array(z.string().min(1)).min(1, {
        message: t("errors.environment", { ns: "input" }),
      }),
      start_date: z.string().min(2, {
        message: t("errors.start-date", { ns: "input" }),
      }),
      end_date: z.string().optional().nullable(),
    })
    .refine(
      (data) => {
        if (data.start_date && data.end_date) {
          const start = new Date(data.start_date).getTime()
          const end = new Date(data.end_date).getTime()
          if (!isNaN(start) && !isNaN(end)) {
            return end >= start
          }
        }
        return true
      },
      {
        message: t("errors.invalid-date-range", { ns: "input" }),
        path: ["end_date"],
      }
    )

export type ProjectFormValues = z.infer<ReturnType<typeof getProjectSchema>>
