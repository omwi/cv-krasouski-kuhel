import { useQuery } from "@apollo/client/react"

import Crumb from "@/components/layout/crumbs/crumb"
import { GET_PROJECT } from "@/graphql/projects/queries"

type Props = {
  projectId: number
  href: string
  isPage: boolean
}

export default function CrumbProject({ projectId, href, isPage }: Props) {
  const { data } = useQuery(GET_PROJECT, {
    variables: { projectId: String(projectId) },
  })
  const label = data?.project?.name || projectId
  return (
    <Crumb href={href} isPage={isPage} isPrimary={true}>
      {label}
    </Crumb>
  )
}
