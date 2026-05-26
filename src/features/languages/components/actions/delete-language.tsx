"use client"

import { useMutation } from "@apollo/client/react"

import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { TableLanguages } from "@/features/languages/components/table/languages-table-columns"
import { DELETE_LANGUAGE } from "@/graphql/languages/mutations"
import { GET_LANGUAGES } from "@/graphql/languages/queries"
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
    refetchQueries: [{ query: GET_LANGUAGES }],
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
