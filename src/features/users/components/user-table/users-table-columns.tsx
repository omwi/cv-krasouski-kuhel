"use client"

import { TableColumnConfig } from "@/components/shared/data-table/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserRowActions } from "@/features/users/components/user-table/user-row-actions"
import { TableUser } from "@/features/users/components/user-table/users-table"
import type { CurrentUser } from "@/utils/permissions"

export const getColumns = (
  currentUser: CurrentUser
): TableColumnConfig<TableUser>[] => [
  {
    id: "avatar",
    titleKey: "user-table.columns.avatar",
    isSrOnly: true,
    sortable: false,
    searchable: false,
    cell: ({ row }) => {
      const initials =
        (row.profile?.first_name?.[0] || "") +
          (row.profile?.last_name?.[0] || "") ||
        row.email?.[0] ||
        "U"

      return (
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={row.profile?.avatar || undefined}
            alt={row.profile?.full_name || "User"}
          />
          <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    id: "firstName",
    titleKey: "user-table.columns.first-name",
    sortable: true,
    searchable: true,
    accessorFn: (row) => row.profile?.first_name || "",
  },
  {
    id: "lastName",
    titleKey: "user-table.columns.last-name",
    sortable: true,
    searchable: true,
    accessorFn: (row) => row.profile?.last_name || "",
  },
  {
    id: "email",
    titleKey: "user-table.columns.email",
    sortable: true,
    searchable: true,
    accessorFn: (row) => row.email || "",
  },
  {
    id: "departmentName",
    titleKey: "user-table.columns.department",
    sortable: true,
    searchable: true,
    accessorFn: (row) => row.department_name || "",
  },
  {
    id: "positionName",
    titleKey: "user-table.columns.position",
    sortable: true,
    searchable: true,
    accessorFn: (row) => row.position_name || "",
  },
  {
    id: "actions",
    titleKey: "user-table.columns.actions",
    isSrOnly: true,
    sortable: false,
    searchable: false,
    cell: ({ row }) => (
      <UserRowActions rowUser={row} currentUser={currentUser} />
    ),
  },
]
