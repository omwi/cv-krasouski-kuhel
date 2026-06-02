import { getT } from "next-i18next/server"

import PreviewActions from "@/features/cvs/components/preview/preview-actions"
import PreviewSection from "@/features/cvs/components/preview/preview-section"
import SectionGroup from "@/features/cvs/components/preview/section-group"
import SkillsPreviewTable from "@/features/cvs/components/preview/skills-preview-table"
import SplitView from "@/features/cvs/components/preview/split-view"
import { CvPreviewData } from "@/types/graphql-types"
import { parseUtcToLocal, toHumanRange } from "@/utils/date"

export default async function CvPreview({
  previewData: { cv, skills, projects },
}: {
  previewData: CvPreviewData
}) {
  const { t, lng } = await getT(["cv-preview", "skills", "project-details"])

  const languages =
    cv.languages?.map((l) => `${l.name} – ${l.proficiency}`) ?? []
  const domains = projects?.map((p) => p.domain) ?? []

  const skillsByCategory = Map.groupBy(skills, (skill) => skill.categoryId)
    .entries()
    .toArray()

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <PreviewActions />
      <article className="flex flex-col gap-16">
        <PreviewSection
          heading={cv.user?.profile.full_name ?? cv.user?.email ?? ""}
          subHeading={cv.user?.position_name?.toUpperCase() ?? ""}
        >
          <SplitView
            left={
              <>
                <SectionGroup
                  heading={t("education")}
                  content={cv.education ?? ""}
                />
                <SectionGroup
                  heading={t("language-proficiency")}
                  content={languages}
                />
                <SectionGroup heading={t("domains")} content={domains} />
              </>
            }
            right={
              <>
                <SectionGroup heading={cv.name} content={cv.description} />
                {skillsByCategory.map(([categoryId, skills]) => (
                  <SectionGroup
                    key={categoryId ?? "other"}
                    heading={t(`category.${categoryId ?? "other"}`, {
                      ns: "skills",
                    })}
                    content={skills.map((s) => s.name)}
                  />
                ))}
              </>
            }
          />
        </PreviewSection>

        <PreviewSection heading={t("projects")}>
          {projects.map((p) => (
            <SplitView
              key={p.id}
              left={
                <SectionGroup
                  heading={p.name}
                  content={p.description}
                  variant="primary"
                />
              }
              right={
                <>
                  <SectionGroup
                    heading={t("project-roles")}
                    content={
                      p.roles.length > 0
                        ? p.roles
                        : (cv.user?.position_name ?? "")
                    }
                  />
                  <SectionGroup
                    heading={t("period")}
                    content={toHumanRange(
                      lng,
                      t("till-now", { ns: "project-details" }),
                      parseUtcToLocal(p.start_date)!,
                      parseUtcToLocal(p.end_date ?? undefined)
                    )}
                  />
                  <SectionGroup
                    heading={t("responsibilities")}
                    content={p.responsibilities}
                    isList={true}
                  />
                  <SectionGroup
                    heading={t("environment")}
                    content={p.environment}
                  />
                </>
              }
            />
          ))}
        </PreviewSection>

        <PreviewSection heading={t("professional-skills")}>
          <SkillsPreviewTable
            skillsByCategory={skillsByCategory}
            projects={projects}
          />
        </PreviewSection>
      </article>
    </div>
  )
}
