"use client"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeleteLanguage from "@/features/languages/components/actions/delete-language"
import UpdateLanguage from "@/features/languages/components/actions/update-language"
import { TableLanguages } from "@/features/languages/components/table/languages-table-columns"

export default function LanguagesRowActions({
  language,
}: {
  language: TableLanguages
}) {
  return (
    <EntityRowActions<TableLanguages>
      entity={language}
      entityType="languages"
      entityId={String(language?.id)}
      renderEditModal={(props) => (
        <UpdateLanguage language={props.entity} {...props} />
      )}
      renderDeleteModal={(props) => (
        <DeleteLanguage language={props.entity} {...props} />
      )}
    />
  )
}
