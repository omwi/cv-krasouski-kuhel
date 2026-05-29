"use client"

import { useSuspenseQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import CvFormFields from "@/features/cvs/components/cv-form-fields"
import { useUpdateCvForm } from "@/features/cvs/hooks/use-update-cv-form"
import { GET_CV } from "@/graphql/cvs/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"

export default function CvDetailsForm({ cvId }: { cvId: string }) {
  const { t } = useT("buttons")

  const { data } = useSuspenseQuery(GET_CV, { variables: { cvId } })
  const { cv } = data

  const { canUpdateCv } = usePermissions()
  const hasUpdatePermissions = canUpdateCv(cv.user?.id)

  const { onSubmit, register, isSubmitting, isSubmitReady, errors } =
    useUpdateCvForm(cv)

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4"
    >
      <CvFormFields
        register={register}
        errors={errors}
        disabled={isSubmitting}
        readOnly={!hasUpdatePermissions}
      />
      <div
        className={cn("flex flex-row justify-end", {
          hidden: !hasUpdatePermissions,
        })}
      >
        <Button type="submit" disabled={!isSubmitReady}>
          {t("update")}
        </Button>
      </div>
    </form>
  )
}
