"use client"

import { useSuspenseQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import { GET_USER } from "@/features/users/graphql/users/queries"
import { toHumanDate } from "@/utils/date"

export default function ProfileTextInfo({ userId }: { userId: string }) {
  const { t, i18n } = useT(["user-profile", "user", "common"])

  const { data } = useSuspenseQuery(GET_USER, { variables: { userId } })
  const { user } = data

  return (
    <div className="flex w-full flex-col items-center">
      <p>{user.profile.full_name}</p>
      <p className="text-secondary-foreground">{user.email}</p>
      <p>
        {t("member-since", {
          date: toHumanDate(new Date(+user.created_at), i18n.language),
        })}
      </p>
    </div>
  )
}
