import { usePathname } from "next/navigation"
import { useT } from "next-i18next/client"

import Crumb from "@/components/layout/crumbs/crumb"
import CrumbCv from "@/components/layout/crumbs/crumb-cv"
import CrumbProject from "@/components/layout/crumbs/crumb-project"
import CrumbUser from "@/components/layout/crumbs/crumb-user"
import { getCrumbI18Key } from "@/config/crumb-i18-keys"
import { getPathParts, joinPathParts } from "@/utils/url"

type Crumb = {
  key: string
  element: React.JSX.Element
}

export function useCrumbs(): Crumb[] {
  const { t } = useT("nav")
  const pathname = usePathname()
  const parts = getPathParts(pathname)

  return parts.map((part, index) => {
    const href = joinPathParts(parts.slice(0, index + 1))
    const isPage = index === parts.length - 1

    if (parts[0] === "users" && index === 1) {
      const userId = parseInt(part)
      return {
        key: href,
        element: (
          <CrumbUser key={href} userId={userId} href={href} isPage={isPage} />
        ),
      }
    }

    if (parts[0] === "cvs" && index === 1) {
      const cvId = parseInt(part)
      return {
        key: href,
        element: <CrumbCv key={href} cvId={cvId} href={href} isPage={isPage} />,
      }
    }

    if (parts[0] === "projects" && index === 1) {
      const projectId = parseInt(part)
      return {
        key: href,
        element: (
          <CrumbProject
            key={href}
            projectId={projectId}
            href={href}
            isPage={isPage}
          />
        ),
      }
    }

    const label = t(getCrumbI18Key(part))
    return {
      key: href,
      element: (
        <Crumb key={href} href={href} isPage={isPage}>
          {label}
        </Crumb>
      ),
    }
  })
}
