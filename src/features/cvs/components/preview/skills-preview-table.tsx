import { getT } from "next-i18next/server"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getSkillExperienceYears,
  getSkillLastUsedYear,
} from "@/features/cvs/utils/skill-experience"
import { CvProject, CvSkill } from "@/types/graphql-types"

export default async function SkillsPreviewTable({
  skillsByCategory,
  projects,
}: {
  skillsByCategory: [string | null, CvSkill[]][]
  projects: CvProject[]
}) {
  const { t } = await getT(["cv-preview", "skills"])

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b-primary">
          <TableHead colSpan={2} className="p-4">
            {t("table.skills")}
          </TableHead>
          <TableHead className="w-32 p-4 text-center wrap-break-word whitespace-normal">
            {t("table.exp-in-years")}
          </TableHead>
          <TableHead className="w-32 p-4 text-center">
            {t("table.last-used")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skillsByCategory.map(([category, skills]) => (
          <TableRow key={category}>
            <TableCell className="align-top font-semibold text-primary">
              {t(`category.${category ?? "other"}`, {
                ns: "skills",
              })}
            </TableCell>
            <TableCell>
              {skills.map((skill, index) => (
                <div key={index} className="h-lh">
                  {skill.name}
                </div>
              ))}
            </TableCell>
            <TableCell className="text-center">
              {skills.map((skill, index) => (
                <div key={index} className="h-lh">
                  {getSkillExperienceYears(projects, skill) || ""}
                </div>
              ))}
            </TableCell>
            <TableCell className="text-center">
              {skills.map((skill, index) => (
                <div key={index} className="h-lh">
                  {getSkillLastUsedYear(projects, skill) || ""}
                </div>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
