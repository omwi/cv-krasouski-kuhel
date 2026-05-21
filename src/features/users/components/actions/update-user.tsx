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
import { TableUser } from "@/features/users/components/user-table/users-table"
import { useUpdateUserForm } from "@/features/users/hooks/use-update-user-form"
import type { CurrentUser } from "@/utils/get-auth-user"

export type UpdateUserProps = {
  user: TableUser
  currentUser: CurrentUser
  children?: ReactNode
  open?: boolean
  onOpenChangeAction?: (open: boolean) => void
}

export default function UpdateUser({
  user,
  currentUser,
  children,
  open: controlledOpen,
  onOpenChangeAction: controlledOnOpenChange,
}: UpdateUserProps) {
  const { t } = useT(["update-user", "input", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen

  const isAdmin = currentUser?.role?.toLowerCase() === "admin"

  const {
    register,
    control,
    onSubmit,
    formState: { errors, isSubmitting },
  } = useUpdateUserForm(user, open, setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("update-user:title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
            <Field>
              <FloatingInput
                id="email"
                label={t("input:email")}
                disabled
                {...register("email")}
              />
            </Field>

            <Field>
              <FloatingPasswordInput
                id="password"
                label={t("input:password")}
                disabled
                value="*********"
              />
            </Field>

            <Field>
              <FloatingInput
                id="firstName"
                label={t("input:first-name")}
                {...register("firstName")}
              />
              {errors.firstName && (
                <FieldError className="mt-1">
                  {errors.firstName.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FloatingInput
                id="lastName"
                label={t("input:last-name")}
                {...register("lastName")}
              />
              {errors.lastName && (
                <FieldError className="mt-1">
                  {errors.lastName.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <Controller
                control={control}
                name="departmentId"
                render={({ field }) => (
                  <DepartmentSelect
                    value={field.value || ""}
                    onValueChangeAction={(val) => field.onChange(val)}
                  />
                )}
              />
            </Field>

            <Field>
              <Controller
                control={control}
                name="positionId"
                render={({ field }) => (
                  <PositionSelect
                    value={field.value || ""}
                    onValueChangeAction={(val) => field.onChange(val)}
                  />
                )}
              />
            </Field>

            <Field>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <RoleSelect
                    value={field.value || ""}
                    onValueChangeAction={(val) => field.onChange(val)}
                    disabled={!isAdmin}
                  />
                )}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t("buttons:cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {t("buttons:update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
