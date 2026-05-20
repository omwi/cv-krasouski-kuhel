"use client"

import { Fragment } from "react/jsx-runtime"

import { useCrumbs } from "@/hooks/use-crumbs"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb"

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
