import type { TFunction } from "i18next"
import { z } from "zod"

export const getLanguageSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, {
      message: t("errors.name", { ns: "input" }),
    }),
    iso2: z.string().length(2, {
      message: t("errors.iso2", { ns: "input" }),
    }),
    native_name: z.string().optional(),
  })

export type LanguageFormValues = z.infer<ReturnType<typeof getLanguageSchema>>
