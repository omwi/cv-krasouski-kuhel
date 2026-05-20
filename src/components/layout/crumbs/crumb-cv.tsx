import { Crumb } from "@/components/layout/crumbs/crumb"

type Props = {
  cvId: number
  href: string
  isPage: boolean
}

export default function CrumbCv({ cvId, href, isPage }: Props) {
  // todo: useCv
  const cvName = "My CV"

  const label = cvName || cvId

  return (
    <Crumb href={href} isPage={isPage} isPrimary={true}>
      {label}
    </Crumb>
  )
}
