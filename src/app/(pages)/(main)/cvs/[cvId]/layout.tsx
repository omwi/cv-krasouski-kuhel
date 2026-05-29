import TabNav, { TabLink } from "@/components/layout/tab-nav/tab-nav"
import { paths } from "@/config/paths"

type Props = {
  children: React.ReactNode
  params: Promise<{ cvId: string }>
}

export default async function ProfileLayout({ children, params }: Props) {
  const { cvId } = await params

  const links: TabLink[] = [
    { href: paths.cvs.details.get(cvId), i18nKey: "details" },
    { href: paths.cvs.skills.get(cvId), i18nKey: "skills" },
    { href: paths.cvs.projects.get(cvId), i18nKey: "projects" },
    { href: paths.cvs.preview.get(cvId), i18nKey: "preview" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <TabNav links={links} i18nNamespace="nav" />
      {children}
    </div>
  )
}
