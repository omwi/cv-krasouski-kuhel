"use client"

import { useRouter } from "next/navigation"
import { PencilLine } from "lucide-react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import UpdateProject from "@/features/projects/components/actions/update-project"
import { TableProjects } from "@/features/projects/components/table/projects-table-columns"
import { usePermissions } from "@/hooks/use-permissions"

type ProjectActionsWrapperProps = {
  project: TableProjects
}

export function ProjectActionsWrapper({ project }: ProjectActionsWrapperProps) {
  const { t } = useT("buttons")
  const router = useRouter()

  const { isAdmin: canCreate } = usePermissions()

  if (!canCreate) return null

  return (
    <UpdateProject project={project} onSuccess={() => router.refresh()}>
      <Button className="w-fit">
        <PencilLine className="mr-2 size-4" />
        {t("update")}
      </Button>
    </UpdateProject>
  )
}
