"use client"

import { useSuspenseQuery } from "@apollo/client/react"

import UserLanguageItem from "@/features/users/components/languages/user-language-item"
import UserLanguagesActions from "@/features/users/components/languages/user-languages-actions"
import { GET_USER_LANGUAGES } from "@/graphql/users/queries"

export default function UserLanguages({ userId }: { userId: string }) {
  const { data } = useSuspenseQuery(GET_USER_LANGUAGES, {
    variables: { userId },
  })
  const userLanguages = data.profile.languages

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8 self-center px-4 py-6">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {userLanguages.map((ul) => (
            <UserLanguageItem key={ul.name} language={ul} userId={userId} />
          ))}
        </div>
      </div>

      <UserLanguagesActions
        userId={userId}
        hasLanguages={userLanguages.length > 0}
      />
    </div>
  )
}
