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

import { GET_POSITIONS } from "../graphql/queries"

type Props = React.ComponentProps<typeof Select>

export default function PositionsSelect({ ...props }: Props) {
  const { t } = useT("position")
  const { data } = useQuery(GET_POSITIONS)
  const positions = data?.positions ?? []

  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder={t("no-position")} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="none">{t("no-position")}</SelectItem>

        {positions.map((department) => (
          <SelectItem key={department.id} value={department.id}>
            {department.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
