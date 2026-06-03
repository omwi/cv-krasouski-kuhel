"use client"

import { ReactNode, useState } from "react"
import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import { FormDialog } from "@/components/shared/dialog/form-dialog"
import { FloatingPasswordInput } from "@/components/shared/input/floating-password-input"
import { RoleSelect } from "@/components/shared/select/role-select"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import DepartmentSelect from "@/features/departments/components/department-select"
import PositionSelect from "@/features/positions/components/position-select"
import { TableUser } from "@/features/users/components/user-table/users-table"
import { useUpdateUserForm } from "@/features/users/hooks/profile/use-update-user-form"
import { usePermissions } from "@/hooks/use-permissions"

type Props = {
  user: TableUser
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function UpdateUser({
  user,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const { t } = useT(["user-actions", "input", "buttons"])
  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const { isAdmin } = usePermissions()

  const {
    register,
    control,
    onSubmit,
    formState: { errors, isSubmitting },
  } = useUpdateUserForm(user, open, setOpen)

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={t("update.title", { ns: "user-actions" })}
      submitLabel={t("update", { ns: "buttons" })}
      trigger={children}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
        <Field>
          <FloatingInput
            id="email"
            label={t("email", { ns: "input" })}
            disabled
            {...register("email")}
          />
        </Field>

        <Field>
          <FloatingPasswordInput
            id="password"
            label={t("password", { ns: "input" })}
            disabled
            value="*********"
          />
        </Field>

        <Field>
          <FloatingInput
            id="firstName"
            label={t("first-name", { ns: "input" })}
            disabled={isSubmitting}
            {...register("firstName")}
          />
          {errors.firstName && (
            <FieldError className="mt-1">{errors.firstName.message}</FieldError>
          )}
        </Field>

        <Field>
          <FloatingInput
            id="lastName"
            label={t("last-name", { ns: "input" })}
            disabled={isSubmitting}
            {...register("lastName")}
          />
          {errors.lastName && (
            <FieldError className="mt-1">{errors.lastName.message}</FieldError>
          )}
        </Field>

        <Field>
          <Controller
            control={control}
            name="departmentId"
            render={({ field }) => (
              <DepartmentSelect
                value={field.value || ""}
                onValueChange={(v) =>
                  v === "none" ? field.onChange("") : field.onChange(v)
                }
                disabled={isSubmitting}
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
                onValueChange={(v) =>
                  v === "none" ? field.onChange("") : field.onChange(v)
                }
                disabled={isSubmitting}
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
                disabled={!isAdmin || isSubmitting}
              />
            )}
          />
        </Field>
      </FieldGroup>
    </FormDialog>
  )
}
