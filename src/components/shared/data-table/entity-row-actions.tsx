"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { ChevronRight, MoreVertical } from "lucide-react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { usePermissions } from "@/hooks/use-permissions"

export type EntityType =
  | "user"
  | "projects"
  | "cvs"
  | "positions"
  | "departments"
  | "skills"
  | "languages"

export interface EntityRowActionsProps<T> {
  entity: T
  entityType: EntityType
  entityId: string
  ownerId?: string
  viewLink?: string
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
  entityId,
  ownerId,
  viewLink,
  renderEditModal,
  renderDeleteModal,
}: EntityRowActionsProps<T>) {
  const { t } = useT("table")

  const [popoverOpen, setPopoverOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const {
    currentUserId,
    isAdmin,
    canUpdateUser,
    canDeleteUser,
    canUpdateCv,
    canDeleteCv,
  } = usePermissions()

  if (!currentUserId) return null

  let canView: boolean
  let canEdit: boolean
  let canDelete: boolean

  switch (entityType) {
    case "user":
      canView = true
      canEdit = canUpdateUser(entityId)
      canDelete = canDeleteUser(entityId)
      break
    case "cvs":
      canView = true
      canEdit = canUpdateCv(ownerId)
      canDelete = canDeleteCv(ownerId)
      break
    case "projects":
      canView = true
      canEdit = isAdmin
      canDelete = isAdmin
      break
    case "positions":
    case "departments":
    case "skills":
    case "languages":
      canView = false
      canEdit = isAdmin
      canDelete = isAdmin
      break
    default:
      const _: never = entityType
      return _
  }

  const showViewAction = canView && !!viewLink
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
        asChild
        variant="ghost"
        className="size-9 min-w-0"
        aria-label={defaultLabels.viewAriaLabel}
      >
        <Link href={viewLink}>
          <ChevronRight />
        </Link>
      </Button>
    )
  }

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="size-9 min-w-0 p-0"
            aria-label={defaultLabels.ariaLabel}
          >
            <MoreVertical className="size-4 text-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          hideWhenDetached
          className="mx-4 w-50 rounded-xs p-0 shadow-lg"
        >
          <div className="flex flex-col">
            {showViewAction && (
              <Button
                asChild
                variant="ghost"
                className="w-full min-w-0 justify-start rounded-none text-foreground"
              >
                <Link href={viewLink}>{defaultLabels.view}</Link>
              </Button>
            )}
            {showEditAction && (
              <Button
                variant="ghost"
                className="w-full min-w-0 justify-start rounded-none text-foreground"
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
