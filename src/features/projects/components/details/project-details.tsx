"use server"

import { getT } from "next-i18next/server"

import { getClient } from "@/apollo-client"
import { Badge } from "@/components/ui/badge"
import { ProjectActionsWrapper } from "@/features/projects/components/actions/update-project-wrapper"
import { GET_PROJECT } from "@/graphql/projects/queries"
import { CurrentUser } from "@/utils/permissions"

export default async function ProjectDetails({
  currentUser,
  projectId,
}: {
  currentUser: CurrentUser
  projectId: string
}) {
  const { data } = await getClient().query({
    query: GET_PROJECT,
    variables: { projectId },
  })

  const project = data?.project

  const { t } = await getT("project-details")

  if (!project) return null

  return (
    <section className="flex max-w-200 flex-col gap-8 py-4 text-secondary-foreground">
      <div className="flex justify-between gap-8 text-xs">
        <div>
          <h2 className="mb-2 text-xl text-foreground">
            {t("project-detail")}:
          </h2>
          <p>
            {t("name")}: {project.name || "-"}
          </p>
          <p>
            {t("internal-name")}: {project.internal_name || "-"}
          </p>
          <p>
            {t("domain")}: {project.domain || "-"}
          </p>
        </div>

        {project.start_date && (
          <div>
            <h2 className="mb-2 text-xl text-foreground">{t("date")}:</h2>
            <div className="flex gap-1 text-nowrap">
              <p>{project.start_date}</p>
              <p>- {project.end_date ? project.end_date : t("till-now")}</p>
            </div>
          </div>
        )}
      </div>
      <div>
        <h2 className="mb-2 text-xl text-foreground">{t("description")}:</h2>
        <p>{project.description || t("no-description")}</p>
      </div>
      <div>
        <h2 className="mb-2 text-xl text-foreground">{t("environment")}:</h2>
        <div className="flex items-center justify-between gap-8 max-sm:flex-col max-sm:items-start max-sm:gap-4">
          {project.environment && project.environment.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {project.environment.map((env) => (
                <li key={env}>
                  <Badge>{env}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t("no-environment")}</p>
          )}

          <ProjectActionsWrapper currentUser={currentUser} project={project} />
        </div>
      </div>
    </section>
  )
}
