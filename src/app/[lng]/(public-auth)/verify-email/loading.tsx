import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-100 w-full items-center justify-center">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  )
}
