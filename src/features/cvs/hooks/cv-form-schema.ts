import { z } from "zod"

export const getCvFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("errors.required")),
    education: z.string(),
    description: z.string().min(1, t("errors.required")),
  })
