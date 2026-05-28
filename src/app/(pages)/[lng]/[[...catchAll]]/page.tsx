import { redirect } from "next/navigation"

import { paths } from "@/config/paths"

export default async function CatchAll({
  params,
}: {
  params: Promise<{ lng: string }>
}) {
  const { lng } = await params
  redirect(`/${lng}${paths.users.get()}`)
}
