"use client"

import { Fragment } from "react/jsx-runtime"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useCrumbs } from "@/hooks/use-crumbs"

export default function BreadcrumbNav() {
  const crumbs = useCrumbs()

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
