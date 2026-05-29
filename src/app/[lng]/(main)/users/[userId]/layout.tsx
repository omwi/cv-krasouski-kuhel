import TabNav, { TabLink } from "@/components/layout/tab-nav/tab-nav"
import { paths } from "@/config/paths"

type Props = {
  children: React.ReactNode
  params: Promise<{ userId: string }>
}

export default async function ProfileLayout({ children, params }: Props) {
  const { userId } = await params

  const links: TabLink[] = [
    { href: paths.users.details.get(userId), i18nKey: "profile" },
    { href: paths.users.skills.get(userId), i18nKey: "skills" },
    { href: paths.users.languages.get(userId), i18nKey: "languages" },
    { href: paths.users.cvs.get(userId), i18nKey: "cvs" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <TabNav links={links} i18nNamespace="nav" />
      {children}
    </div>
  )
}
