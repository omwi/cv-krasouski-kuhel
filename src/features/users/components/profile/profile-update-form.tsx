"use client"

import { useT } from "next-i18next/client"
import { Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"
import DepartmentsSelect from "@/features/departments/components/departments-select"
import PositionsSelect from "@/features/positions/components/positions-select"

import { useProfileUpdateForm } from "../../hooks/use-profile-update-form"

export default function ProfileUpdateForm({ userId }: { userId: string }) {
  const { t } = useT(["user-profile", "user", "common"])

  const { onSubmit, register, control, errors, isDirty, isPending } =
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
            autoFocus
            label={t("first-name", { ns: "user" })}
            {...register("firstName")}
          />
        </Field>
        <Field>
          <FloatingInput
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
        {t("update", { ns: "common" })}
      </Button>
    </form>
  )
}
