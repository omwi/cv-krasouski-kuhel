"use client"

import { ColumnDef } from "@tanstack/react-table"
import { useT } from "next-i18next/client"

import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserRowActions } from "@/features/users/components/user-table/user-row-actions"
import { TableUser } from "@/features/users/components/user-table/users-table"
import type { CurrentUser } from "@/utils/permissions"

const SRHeader = ({ titleKey }: { titleKey: string }) => {
  const { t } = useT("users")
  return <span className="sr-only">{t(titleKey)}</span>
}

const SortableHeader = ({
  titleKey,
  sortKey,
}: {
  titleKey: string
  sortKey: string
}) => {
  const { t } = useT("users")

  return (
    <DataTableColumnHeader
      title={t(titleKey)}
      sortKey={sortKey}
      defaultSortBy="firstName"
    />
  )
}

export const getColumns = (
  currentUser: CurrentUser
): ColumnDef<TableUser>[] => [
  {
    id: "avatar",
    header: () => <SRHeader titleKey="profile-image" />,
    cell: ({ row }) => {
      const user = row.original
      const initials =
        (user.profile?.first_name?.[0] || "") +
          (user.profile?.last_name?.[0] || "") ||
        user.email?.[0] ||
        "U"

      return (
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={user.profile?.avatar || undefined}
            alt={user.profile?.full_name || "User"}
          />
          <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    id: "firstName",
    accessorFn: (row) => row.profile?.first_name || "",
    header: () => <SortableHeader titleKey="first-name" sortKey="firstName" />,
  },
  {
    id: "lastName",
    accessorFn: (row) => row.profile?.last_name || "",
    header: () => <SortableHeader titleKey="last-name" sortKey="lastName" />,
  },
  {
    id: "email",
    accessorFn: (row) => row.email || "",
    header: () => <SortableHeader titleKey="email" sortKey="email" />,
  },
  {
    id: "departmentName",
    accessorFn: (row) => row.department_name || "",
    header: () => (
      <SortableHeader titleKey="department" sortKey="departmentName" />
    ),
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("departmentName")}</div>
    },
  },
  {
    id: "positionName",
    accessorFn: (row) => row.position_name || "",
    header: () => <SortableHeader titleKey="position" sortKey="positionName" />,
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("positionName")}</div>
    },
  },
  {
    id: "actions",
    header: () => <SRHeader titleKey="control-actions.aria-label" />,
    cell: ({ row }) => (
      <UserRowActions rowUser={row.original} currentUser={currentUser} />
    ),
  },
]
