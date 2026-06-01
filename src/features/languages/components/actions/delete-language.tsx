"use client"

import { useMutation } from "@apollo/client/react"

import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { TableLanguages } from "@/features/languages/components/table/languages-table-columns"
import { DELETE_LANGUAGE } from "@/graphql/languages/mutations"
import {
  DeleteLanguageMutation,
  DeleteLanguageMutationVariables,
} from "@/types/__generated__/graphql"

export type Props = {
  language: TableLanguages
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function DeleteLanguage({
  language,
  open = false,
  onOpenChange = () => {},
}: Props) {
  const [mutateDelete] = useMutation<
    DeleteLanguageMutation,
    DeleteLanguageMutationVariables
  >(DELETE_LANGUAGE, {
    update(cache) {
      if (language) {
        cache.evict({
          id: cache.identify({ __typename: "Language", id: language.id }),
        })
        cache.gc()
      }
    },
  })
  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      i18nKey="language-actions"
      entityName={language?.name}
      onConfirm={async () => {
        await mutateDelete({
          variables: { language: { languageId: String(language?.id) } },
        })
      }}
    />
  )
}
