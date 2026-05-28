import { getT } from "next-i18next/server"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("cvs.title"),
    description: t("cvs.description"),
  }
}

export default function Cvs() {
  return <div>Cvs</div>
}
