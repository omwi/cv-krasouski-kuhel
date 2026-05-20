"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoveDown, MoveUp } from "lucide-react"
import { useT } from "next-i18next/client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserRowActions } from "@/features/users/components/user-row-actions"
import { TableUser } from "@/features/users/components/users-table"
import { useUsersUrlState } from "@/features/users/hooks/use-users-url-state"

const SRHeader = ({ titleKey }: { titleKey: string }) => {
  const { t } = useT("user-table")
  return <span className="sr-only">{t(titleKey)}</span>
}

const SortableHeader = ({
  titleKey,
  sortKey,
}: {
  titleKey: string
  sortKey: string
}) => {
  const { params, updateParams } = useUsersUrlState()
  const { t } = useT("user-table")

  const isSorted = params.sortBy === sortKey
  const isAsc = isSorted && params.sortOrder === "asc"

  const toggleSort = () => {
    if (!isSorted) {
      updateParams({ sortBy: sortKey, sortOrder: "asc", page: 1 })
    } else if (isAsc) {
      updateParams({ sortOrder: "desc", page: 1 })
    } else {
      if (sortKey === "firstName") {
        updateParams({ sortOrder: "asc", page: 1 })
      } else {
        updateParams({ sortBy: "firstName", sortOrder: "asc", page: 1 })
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSort}
      className="h-full min-w-0 justify-start p-4 text-foreground hover:bg-transparent"
    >
      <span>{t(titleKey)}</span>
      {isSorted && isAsc && <MoveUp className="ml-2 h-4 w-4" />}
      {isSorted && !isAsc && <MoveDown className="ml-2 h-4 w-4" />}
    </Button>
  )
}

export const columns: ColumnDef<TableUser>[] = [
  {
    id: "avatar",
    header: () => <SRHeader titleKey="profile" />,
    cell: ({ row }) => {
      const user = row.original
      const initials =
        (user.profile?.first_name?.[0] || "") +
          (user.profile?.last_name?.[0] || "") ||
        user.email?.[0] ||
        ""
      ;("U")

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
    cell: ({ row }) => <UserRowActions rowUser={row.original} />,
  },
]
