import { z } from "zod"

export const cvProjectSchema = z.object({
  projectId: z.string().min(1),
  responsibilities: z.string(),
  startDate: z.string().min(1),
  endDate: z.string().nullable(),
})

export type CvProjectFormValues = z.infer<typeof cvProjectSchema>
