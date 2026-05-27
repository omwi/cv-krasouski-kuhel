import Crumb from "@/components/layout/crumbs/crumb"

type Props = {
  projectId: number
  href: string
  isPage: boolean
}

export default function CrumbProject({ projectId, href, isPage }: Props) {
  // todo: project
  const projectName = "project 1"

  const label = projectName || projectId

  return (
    <Crumb href={href} isPage={isPage} isPrimary={true}>
      {label}
    </Crumb>
  )
}
