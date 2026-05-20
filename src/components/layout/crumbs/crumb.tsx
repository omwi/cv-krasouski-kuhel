import Link from "next/link"

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

type Props = {
  children: React.ReactNode
  href: string
  isPage?: boolean
  isPrimary?: boolean
}

export default function Crumb({
  children,
  href,
  isPage = false,
  isPrimary = false,
}: Props) {
  return (
    <BreadcrumbItem>
      {isPage ? (
        <BreadcrumbPage variant={isPrimary ? "primary" : "default"}>
          {children}
        </BreadcrumbPage>
      ) : (
        <BreadcrumbLink asChild variant={isPrimary ? "primary" : "default"}>
          <Link href={href}>{children}</Link>
        </BreadcrumbLink>
      )}
    </BreadcrumbItem>
  )
}
