"use client"

import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import { FloatingSelect } from "@/components/ui/floating-select"
import { Select, SelectItem } from "@/components/ui/select"
import { GET_DEPARTMENTS } from "@/graphql/departments/queries"

type Props = React.ComponentProps<typeof Select>

export default function DepartmentSelect({ value, ...props }: Props) {
  const { t } = useT(["input", "common"])
  const { data } = useQuery(GET_DEPARTMENTS)
  const departments = data?.departments ?? []

  return (
    <FloatingSelect label={t("department")} value={value || "none"} {...props}>
      <SelectItem value="none">
        {t("no-department", { ns: "common" })}
      </SelectItem>
      {departments.map((department) => (
        <SelectItem key={department.id} value={department.id}>
          {department.name}
        </SelectItem>
      ))}
    </FloatingSelect>
  )
}
