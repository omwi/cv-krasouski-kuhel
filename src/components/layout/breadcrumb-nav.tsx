import { Fragment } from "react/jsx-runtime"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"

export type BreadcrumbItemData =
  | {
      type: "link"
      href: string
      title: string
      isPrimary?: boolean
    }
  | {
      type: "text"
      title: string
      isPrimary?: boolean
    }

type Props = {
  items: BreadcrumbItemData[]
}

export default function BreadcrumbNav({ items }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={index}>
            {index !== 0 && <BreadcrumbSeparator />}
            <Item item={item} />
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function Item({ item }: { item: BreadcrumbItemData }) {
  return (
    <BreadcrumbItem>
      {item.type === "link" ? (
        <BreadcrumbLink
          asChild
          variant={item.isPrimary ? "primary" : "default"}
        >
          <Link href={item.href}>{item.title}</Link>
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage variant={item.isPrimary ? "primary" : "default"}>
          {item.title}
        </BreadcrumbPage>
      )}
    </BreadcrumbItem>
  )
}
