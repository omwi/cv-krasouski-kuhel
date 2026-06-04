import { ReactNode } from "react"
import { useT } from "next-i18next/client"

type Props = {
  category: string
  children: ReactNode
}

export default function SharedSkillsCategory({ category, children }: Props) {
  const { t } = useT("skills")

  return (
    <div className="flex flex-col gap-2">
      <p>{t(`category.${category}`)}</p>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  )
}
