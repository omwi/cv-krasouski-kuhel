"use client"

import { useSuspenseQuery } from "@apollo/client/react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import UpdateProject from "@/features/projects/components/actions/update-project"
import { GET_PROJECT } from "@/graphql/projects/queries"
import { adminOnlyPermissions, CurrentUser } from "@/utils/permissions"

export default function ProjectDetail({
  currentUser,
  projectId,
}: {
  currentUser: CurrentUser
  projectId: string
}) {
  const { t } = useT(["table", "buttons"])
  const { data } = useSuspenseQuery(GET_PROJECT, {
    variables: { projectId },
  })

  const canCreate = adminOnlyPermissions.canCreate(currentUser)
  const project = data.project

  return (
    <section className="flex max-w-200 flex-col gap-8 py-4 text-secondary-foreground">
      <div className="flex justify-between gap-8 text-xs">
        <div>
          <h2 className="mb-2 text-xl text-foreground">Project Details</h2>
          <p>Project name: {data.project.name || "-"}</p>
          <p>Internal name: {data.project.internal_name || "-"}</p>
          <p>Domain: {data.project.domain || "-"}</p>
        </div>

        {project.start_date && (
          <div>
            <h2 className="mb-2 text-xl text-foreground">Date: </h2>

            <div className="flex gap-1">
              <p>{data.project.start_date}</p>

              {data.project.end_date ? (
                <p>- {data.project.end_date}</p>
              ) : (
                <p>- Till now</p>
              )}
            </div>
          </div>
        )}
      </div>
      <div>
        <h2 className="mb-2 text-xl text-foreground">Project Description:</h2>
        <p>{data.project.description || "No Description"}</p>
      </div>

      <div>
        <h2 className="mb-2 text-xl text-foreground">Project Environment:</h2>

        <ul className="flex flex-wrap gap-2">
          {project.environment ? (
            project.environment.map((env) => (
              <li key={env}>
                <Badge>{env}</Badge>
              </li>
            ))
          ) : (
            <p>No Environment</p>
          )}
        </ul>
      </div>

      {canCreate && (
        <UpdateProject project={project}>
          <Button variant="outline-primary" className="ml-auto w-fit">
            <Plus />
            {t("projects-table.control-actions.update", { ns: "table" })}
          </Button>
        </UpdateProject>
      )}
    </section>
  )
}
