"use client"

import { Fragment } from "react/jsx-runtime"
import { usePathname } from "next/navigation"
import { useT } from "next-i18next/client"

import { Crumb } from "@/components/layout/crumb"
import CrumbCv from "@/components/layout/crumb-cv"
import CrumbUser from "@/components/layout/crumb-user"
import { getCrumbI18Key } from "@/config/crumb-i18-keys"
import { getPathParts, joinPathParts } from "@/utils/url"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"

export default function BreadcrumbNav() {
  const { t } = useT("nav")
  const pathname = usePathname()
  const parts = getPathParts(pathname)

  const crumbs = parts.map((part, index) => {
    const href = joinPathParts(parts.slice(0, index + 1))
    const isPage = index === parts.length - 1

    if (parts[0] === "users" && index === 1) {
      const userId = parseInt(part)
      return {
        key: href,
        element: (
          <CrumbUser key={index} userId={userId} href={href} isPage={isPage} />
        ),
      }
    }

    if (parts[0] === "cvs" && index === 1) {
      const cvId = parseInt(part)
      return {
        key: href,
        element: (
          <CrumbCv key={index} cvId={cvId} href={href} isPage={isPage} />
        ),
      }
    }

    const label = t(getCrumbI18Key(part))
    return {
      key: href,
      element: (
        <Crumb key={index} href={href} isPage={isPage}>
          {label}
        </Crumb>
      ),
    }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.key}>
            {index !== 0 && <BreadcrumbSeparator />}
            {crumb.element}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
