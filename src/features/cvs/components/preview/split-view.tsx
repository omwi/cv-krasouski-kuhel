import { Separator } from "@/components/ui/separator"

type Props = {
  left: React.ReactNode
  right: React.ReactNode
}

export default function SplitView({ left, right }: Props) {
  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-2 flex-col gap-3">{left}</div>
      <Separator orientation="vertical" className="bg-primary" />
      <div className="flex flex-3 flex-col gap-3">{right}</div>
    </div>
  )
}
