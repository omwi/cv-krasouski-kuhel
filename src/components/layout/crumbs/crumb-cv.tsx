import { useQuery } from "@apollo/client/react"

import Crumb from "@/components/layout/crumbs/crumb"
import { GET_CV } from "@/graphql/cvs/queries"

type Props = {
  cvId: number
  href: string
  isPage: boolean
}

export default function CrumbCv({ cvId, href, isPage }: Props) {
  const { data } = useQuery(GET_CV, { variables: { cvId: String(cvId) } })
  const label = data?.cv.name || cvId

  return (
    <Crumb href={href} isPage={isPage} isPrimary={true}>
      {label}
    </Crumb>
  )
}
