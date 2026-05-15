import Link from "next/link"

import { paths } from "@/config/paths"

import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

const user = {
  id: 1,
}

export default function Actions() {
  const { id } = user

  return (
    <div>
      <Link href={paths.users.profile.get(id)}>Profile</Link>
      <Link href={paths.settings.get()}>Settings</Link>
      <Separator />
      <Button>Logout</Button>
    </div>
  )
}
