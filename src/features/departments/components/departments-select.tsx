"use client"

import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { GET_DEPARTMENTS } from "../graphql/queries"

type Props = React.ComponentProps<typeof Select>

export default function DepartmentsSelect({ ...props }: Props) {
  const { t } = useT("department")
  const { data } = useQuery(GET_DEPARTMENTS)
  const departments = data?.departments ?? []

  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder={t("no-department")} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="none">{t("no-department")}</SelectItem>

        {departments.map((department) => (
          <SelectItem key={department.id} value={department.id}>
            {department.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
