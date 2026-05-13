import { redirect } from "next/navigation"

import { paths } from "@/config/paths"

export default async function CatchAll() {
  redirect(paths.users.get())
}
