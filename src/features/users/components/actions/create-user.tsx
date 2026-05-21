"use client"

import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import { FloatingPasswordInput } from "@/components/shared/input/floating-password-input"
import { DepartmentSelect } from "@/components/shared/select/department-select"
import { PositionSelect } from "@/components/shared/select/position-select"
import { RoleSelect } from "@/components/shared/select/role-select"
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
import { useCreateUserForm } from "@/features/users/hooks/use-create-user-form"
import type { CurrentUser } from "@/utils/get-auth-user"

export type CreateUserProps = {
  currentUser: CurrentUser
  children: ReactNode
}

export default function CreateUser({ currentUser, children }: CreateUserProps) {
  const { t } = useT(["create-user", "input", "buttons"])
  const [open, setOpen] = useState(false)
  const isAdmin = currentUser?.role?.toLowerCase() === "admin"

  const {
    register,
    control,
    onSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useCreateUserForm(open, setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-[920px] gap-8">
        <DialogHeader>
          <DialogTitle>{t("create-user:title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <Field className="w-full md:min-w-[410px]">
              <FloatingInput
                id="email"
                label={t("input:email")}
                disabled={isSubmitting}
                {...register("email")}
              />
              {errors.email && (
                <FieldError className="mt-1">{errors.email.message}</FieldError>
              )}
            </Field>

            <Field className="w-full md:min-w-[410px]">
              <FloatingPasswordInput
                id="password"
                label={t("input:password")}
                disabled={isSubmitting}
                {...register("password")}
              />
              {errors.password && (
                <FieldError className="mt-1">
                  {errors.password.message}
                </FieldError>
              )}
            </Field>

            <Field className="w-full md:min-w-[410px]">
              <FloatingInput
                id="firstName"
                label={t("input:first-name")}
                disabled={isSubmitting}
                {...register("firstName")}
              />
              {errors.firstName && (
                <FieldError className="mt-1">
                  {errors.firstName.message}
                </FieldError>
              )}
            </Field>

            <Field className="w-full md:min-w-[410px]">
              <FloatingInput
                id="lastName"
                label={t("input:last-name")}
                disabled={isSubmitting}
                {...register("lastName")}
              />
              {errors.lastName && (
                <FieldError className="mt-1">
                  {errors.lastName.message}
                </FieldError>
              )}
            </Field>

            <Field className="w-full md:min-w-[410px]">
              <Controller
                control={control}
                name="departmentId"
                render={({ field }) => (
                  <DepartmentSelect
                    value={field.value || ""}
                    onValueChangeAction={(val) => field.onChange(val)}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Field>

            <Field className="w-full md:min-w-[410px]">
              <Controller
                control={control}
                name="positionId"
                render={({ field }) => (
                  <PositionSelect
                    value={field.value || ""}
                    onValueChangeAction={(val) => field.onChange(val)}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Field>

            <Field className="w-full md:min-w-[410px]">
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <RoleSelect
                    value={field.value || ""}
                    onValueChangeAction={(val) => field.onChange(val)}
                    disabled={!isAdmin || isSubmitting}
                  />
                )}
              />
              {errors.role && (
                <FieldError className="mt-1">{errors.role.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="m-0 mt-8 p-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                {t("buttons:cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {t("buttons:create") || "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
