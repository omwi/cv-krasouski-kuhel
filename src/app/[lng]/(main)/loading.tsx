import { Loader2 } from "lucide-react"

export default function MainLoading() {
  return (
    <div className="flex h-100 w-full items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  )
}
