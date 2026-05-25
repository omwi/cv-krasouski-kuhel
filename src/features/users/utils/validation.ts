import type { TFunction } from "i18next"
import * as z from "zod"

export const createUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  departmentId: z.string().optional(),
  positionId: z.string().optional(),
  role: z.string(),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  departmentId: z.string().optional(),
  positionId: z.string().optional(),
  role: z.string().optional(),
})

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>

export const getCreateUserSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string()
      .min(1, { message: t("errors.first-name", { ns: "input" }) }),
    lastName: z
      .string()
      .min(1, { message: t("errors.last-name", { ns: "input" }) }),
    email: z.string().email({ message: t("errors.email", { ns: "input" }) }),
    password: z
      .string()
      .min(6, { message: t("errors.password", { ns: "input" }) }),
    departmentId: z.string().optional(),
    positionId: z.string().optional(),
    role: z.string().min(1, { message: t("errors.role", { ns: "input" }) }),
  })

export const getUpdateUserSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string()
      .min(1, { message: t("errors.first-name", { ns: "input" }) }),
    lastName: z
      .string()
      .min(1, { message: t("errors.last-name", { ns: "input" }) }),
    email: z.string(),
    departmentId: z.string().optional(),
    positionId: z.string().optional(),
    role: z.string().optional(),
  })
