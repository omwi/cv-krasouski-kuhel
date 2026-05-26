import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  children: React.ReactNode
  trigger: React.ReactNode
  title: string
  confirmButtonText: string
  cancelButtonText: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel: () => void
  formId: string
  isReady?: boolean
  className?: string
}

export default function FormDialog({
  children,
  trigger,
  title,
  formId,
  confirmButtonText,
  cancelButtonText,
  isReady,
  open,
  onOpenChange,
  onCancel,
  className,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={className} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {children}

        <DialogFooter>
          <Button variant={"outline"} onClick={onCancel}>
            {cancelButtonText}
          </Button>
          <Button type="submit" form={formId} disabled={!isReady}>
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
