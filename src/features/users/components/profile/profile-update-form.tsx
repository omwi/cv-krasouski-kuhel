"use client"

import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import DepartmentSelect from "@/features/departments/components/department-select"
import PositionSelect from "@/features/positions/components/position-select"
import { useProfileUpdateForm } from "@/features/users/hooks/profile/use-profile-update-form"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"

export default function ProfileUpdateForm({ userId }: { userId: string }) {
  const { t } = useT(["users", "buttons"])

  const { canUpdateUser } = usePermissions()
  const hasUpdatePermission = canUpdateUser(userId)

  const { onSubmit, register, control, isDirty, isPending } =
    useProfileUpdateForm(userId)

  const isReadyForUpdate = isDirty && !isPending

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-3xl flex-col gap-6 p-2"
    >
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FloatingInput
            readOnly={!hasUpdatePermission}
            autoFocus
            label={t("first-name")}
            {...register("firstName")}
          />
        </Field>
        <Field>
          <FloatingInput
            readOnly={!hasUpdatePermission}
            label={t("last-name")}
            {...register("lastName")}
          />
        </Field>
        <Field>
          <Controller
            control={control}
            name="departmentId"
            render={({ field }) => (
              <DepartmentSelect
                disabled={!hasUpdatePermission}
                value={field.value}
                onValueChange={(v) =>
                  v === "none" ? field.onChange("") : field.onChange(v)
                }
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
                disabled={!hasUpdatePermission}
                value={field.value}
                onValueChange={(v) =>
                  v === "none" ? field.onChange("") : field.onChange(v)
                }
              />
            )}
          />
        </Field>
      </div>
      <Button
        disabled={!isReadyForUpdate || !hasUpdatePermission}
        className={cn("md:w-1/2 md:self-end", !hasUpdatePermission && "hidden")}
      >
        {t("update", { ns: "buttons" })}
      </Button>
    </form>
  )
}
