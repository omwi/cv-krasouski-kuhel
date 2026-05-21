"use client"

import { ReactNode } from "react"
import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import { FloatingInput } from "@/components/ui/floating-label-input"

export default function UpdateUser({ children }: { children: ReactNode }) {
  const { t } = useT(["update-user", "input", "buttons"])

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full min-w-0 justify-start rounded-none text-foreground"
          >
            {children}
          </Button>
        </DialogTrigger>
        <DialogContent className="gap-8">
          <DialogHeader>
            <DialogTitle>{t("update-user:title")}</DialogTitle>
          </DialogHeader>

          <FieldGroup className="grid grid-cols-[400px_400px] gap-4">
            <FloatingInput label={t("input:email")} />
            <FloatingInput label={t("input:password")} />
            <FloatingInput label={t("input:first-name")} />
            <FloatingInput label={t("input:last-name")} />
            <FloatingInput label={t("input:department")} />
            <FloatingInput label={t("input:position")} />
            <FloatingInput label={t("input:role")} />
          </FieldGroup>

          <DialogFooter className="m-0 p-0">
            <DialogClose asChild>
              <Button variant="outline">{t("buttons:cancel")}</Button>
            </DialogClose>
            <Button type="submit">{t("buttons:update")}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
