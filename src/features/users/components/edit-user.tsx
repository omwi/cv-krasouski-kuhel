"use client"

import { useT } from "next-i18next/client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function EditUser() {
  const { t } = useT("button")

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          {/*<FieldGroup>*/}
          {/*  <Field>*/}
          {/*    <Label htmlFor="name-1">Name</Label>*/}
          {/*    <Input id="name-1" name="name" defaultValue="Pedro Duarte" />*/}
          {/*  </Field>*/}
          {/*  <Field>*/}
          {/*    <Label htmlFor="username-1">Username</Label>*/}
          {/*    <Input id="username-1" name="username" defaultValue="@peduarte" />*/}
          {/*  </Field>*/}
          {/*</FieldGroup>*/}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
