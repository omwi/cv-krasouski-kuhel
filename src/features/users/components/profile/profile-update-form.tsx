"use client"

import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import DepartmentsSelect from "@/features/departments/components/departments-select"
import PositionsSelect from "@/features/positions/components/positions-select"
import { usePermission } from "@/hooks/use-permissions"

import { useProfileUpdateForm } from "../../hooks/use-profile-update-form"

export default function ProfileUpdateForm({ userId }: { userId: string }) {
  const { t } = useT(["user", "buttons"])

  const { onSubmit, register, control, isDirty, isPending } =
    useProfileUpdateForm(userId)

  const { canUpdateUser } = usePermission()

  const isReadyForUpdate = isDirty && !isPending

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-3xl flex-col gap-6 p-2"
    >
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FloatingInput
            readOnly={!canUpdateUser(userId)}
            autoFocus
            label={t("first-name", { ns: "user" })}
            {...register("firstName")}
          />
        </Field>
        <Field>
          <FloatingInput
            readOnly={!canUpdateUser(userId)}
            label={t("last-name", { ns: "user" })}
            {...register("lastName")}
          />
        </Field>
        <Field>
          <Controller
            control={control}
            name="departmentId"
            render={({ field }) => (
              <DepartmentsSelect
                disabled={!canUpdateUser(userId)}
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
              <PositionsSelect
                disabled={!canUpdateUser(userId)}
                value={field.value}
                onValueChange={(v) =>
                  v === "none" ? field.onChange("") : field.onChange(v)
                }
              />
            )}
          />
        </Field>
      </div>
      <Button disabled={!isReadyForUpdate} className="md:w-1/2 md:self-end">
        {t("update", { ns: "buttons" })}
      </Button>
    </form>
  )
}
