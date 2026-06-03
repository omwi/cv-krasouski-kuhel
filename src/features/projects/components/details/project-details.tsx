import { getT } from "next-i18next/server"

import { Badge } from "@/components/ui/badge"
import { ProjectActionsWrapper } from "@/features/projects/components/actions/update-project-wrapper"
import { GetProjectQuery } from "@/types/__generated__/graphql"
import { parseUtcToLocal, toHumanDate } from "@/utils/date"

type ProjectDetailsProps = {
  project: NonNullable<GetProjectQuery["project"]>
}

export default async function ProjectDetails({ project }: ProjectDetailsProps) {
  const { t, lng } = await getT("project-details")

  const startDate = parseUtcToLocal(project.start_date || undefined)
  const endDate = parseUtcToLocal(project.end_date || undefined)

  const formattedStart = startDate ? toHumanDate(startDate, lng) : ""
  const formattedEnd = endDate ? toHumanDate(endDate, lng) : t("till-now")

  return (
    <section className="flex max-w-3xl flex-col gap-8 py-4 text-secondary-foreground">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-wider text-secondary-foreground uppercase">
          {t("project-detail")}
        </span>
        <h1 className="text-3xl font-bold text-foreground">
          {project.name || "-"}
        </h1>
      </div>

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
              <p>{formattedStart}</p>
              <p>- {formattedEnd}</p>
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

          <ProjectActionsWrapper project={project} />
        </div>
      </div>
    </section>
  )
}
