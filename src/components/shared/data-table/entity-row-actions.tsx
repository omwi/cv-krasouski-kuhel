"use client"

import { ReactNode, useState } from "react"
import { ChevronRight, MoreVertical } from "lucide-react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { CurrentUser } from "@/utils/permissions"

export interface EntityRowActionsProps<T> {
  entity: T
  entityType: "user" | "project" | "cv" | "positions" | "departments"
  entityId: string
  currentUser: CurrentUser
  isOwner?: boolean
  isMe?: boolean
  onView?: (entity: T) => void
  renderEditModal?: (props: {
    entity: T
    open: boolean
    onOpenChange: (open: boolean) => void
  }) => ReactNode
  renderDeleteModal?: (props: {
    entity: T
    open: boolean
    onOpenChange: (open: boolean) => void
  }) => ReactNode
}

export function EntityRowActions<T>({
  entity,
  entityType,
  currentUser,
  isOwner = false,
  isMe = false,
  onView,
  renderEditModal,
  renderDeleteModal,
}: EntityRowActionsProps<T>) {
  const { t } = useT("table")

  const [popoverOpen, setPopoverOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!currentUser) return null

  const isAdmin = currentUser.role?.toLowerCase() === "admin"
  const isEmployee = currentUser.role?.toLowerCase() === "employee"

  let canView: boolean
  let canEdit: boolean
  let canDelete: boolean
  let isDeleteDisabled = false

  switch (entityType) {
    case "user":
      canView = isAdmin || isEmployee
      canEdit = isAdmin || isMe
      canDelete = isAdmin
      isDeleteDisabled = isMe
      break
    case "project":
      canView = true
      canEdit = isAdmin
      canDelete = isAdmin
      break
    case "cv":
      canView = true
      canEdit = isAdmin || isOwner
      canDelete = isAdmin || isOwner
      break
    default:
      canView = false
      canEdit = isAdmin
      canDelete = isAdmin
      break
  }

  const showViewAction = canView && !!onView
  const showEditAction = canEdit && !!renderEditModal
  const showDeleteAction = canDelete && !!renderDeleteModal

  const totalActionsCount =
    (showViewAction ? 1 : 0) +
    (showEditAction ? 1 : 0) +
    (showDeleteAction ? 1 : 0)

  if (totalActionsCount === 0) {
    return null
  }

  const defaultLabels = {
    ariaLabel: t(`${entityType}-table.control-actions.aria-label`),
    view: t(`${entityType}-table.control-actions.profile`),
    edit: t(`${entityType}-table.control-actions.update`),
    delete: t(`${entityType}-table.control-actions.delete`),
    viewAriaLabel: t(`${entityType}-table.open-profile-aria-label`, {
      name:
        (entity as { profile?: { full_name?: string }; name?: string })?.profile
          ?.full_name || (entity as { name?: string })?.name,
    }),
  }

  if (totalActionsCount === 1 && showViewAction) {
    return (
      <Button
        variant="ghost"
        className="h-9 w-9 min-w-0"
        onClick={() => onView?.(entity)}
        aria-label={defaultLabels.viewAriaLabel}
      >
        <ChevronRight />
      </Button>
    )
  }

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 w-9 min-w-0 p-0"
            aria-label={defaultLabels.ariaLabel}
          >
            <MoreVertical className="h-4 w-4 text-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          hideWhenDetached
          className="mx-4 w-fit min-w-50 rounded-xs p-0 shadow-lg"
        >
          <div className="flex flex-col">
            {showViewAction && (
              <Button
                variant="ghost"
                className="min-w-0 justify-start rounded-none text-foreground"
                onClick={() => {
                  setPopoverOpen(false)
                  onView?.(entity)
                }}
              >
                {defaultLabels.view}
              </Button>
            )}
            {showEditAction && (
              <Button
                variant="ghost"
                className="min-w-0 justify-start rounded-none text-foreground"
                onClick={() => {
                  setPopoverOpen(false)
                  setEditOpen(true)
                }}
              >
                {defaultLabels.edit}
              </Button>
            )}
            {showDeleteAction && (
              <Button
                variant="ghost"
                className="w-full min-w-0 justify-start rounded-none text-foreground"
                disabled={isDeleteDisabled}
                onClick={() => {
                  setPopoverOpen(false)
                  setDeleteOpen(true)
                }}
              >
                {defaultLabels.delete}
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {editOpen &&
        renderEditModal &&
        renderEditModal({
          entity,
          open: editOpen,
          onOpenChange: setEditOpen,
        })}

      {deleteOpen &&
        renderDeleteModal &&
        renderDeleteModal({
          entity,
          open: deleteOpen,
          onOpenChange: setDeleteOpen,
        })}
    </>
  )
}
