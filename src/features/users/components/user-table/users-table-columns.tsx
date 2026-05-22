"use client"

import { TableColumnConfig } from "@/components/shared/data-table/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserRowActions } from "@/features/users/components/user-table/user-row-actions"
import { TableUser } from "@/features/users/components/user-table/users-table"
import type { CurrentUser } from "@/utils/permissions"

export const getColumns = (
  currentUser: CurrentUser
): TableColumnConfig<TableUser>[] => [
  {
    id: "avatar",
    titleKey: "columns.avatar",
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
    titleKey: "columns.firstName",
    sortable: true,
    searchable: true,
    accessorFn: (row) => row.profile?.first_name || "",
  },
  {
    id: "lastName",
    titleKey: "columns.lastName",
    sortable: true,
    searchable: true,
    accessorFn: (row) => row.profile?.last_name || "",
  },
  {
    id: "email",
    titleKey: "columns.email",
    sortable: true,
    searchable: true,
    accessorFn: (row) => row.email || "",
  },
  {
    id: "departmentName",
    titleKey: "columns.department",
    sortable: true,
    searchable: true,
    accessorFn: (row) => row.department_name || "",
  },
  {
    id: "positionName",
    titleKey: "columns.position",
    sortable: true,
    searchable: true,
    accessorFn: (row) => row.position_name || "",
  },
  {
    id: "actions",
    titleKey: "columns.actions",
    isSrOnly: true,
    sortable: false,
    searchable: false,
    cell: ({ row }) => (
      <UserRowActions rowUser={row} currentUser={currentUser} />
    ),
  },
]
