import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <section className="flex w-full flex-col items-center gap-6 pt-8 md:gap-12">
      <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
        <Skeleton className="h-32 w-32 shrink-0 rounded-full" />
        <Skeleton className="hidden h-32 w-100 rounded-md md:block" />
      </div>

      <div className="flex w-full flex-col items-center gap-2">
        <Skeleton className="mb-2 h-7 w-48" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-5 w-40" />
      </div>

      <div className="flex w-full max-w-3xl flex-col gap-6 p-2">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
        <Skeleton className="hidden h-10 w-1/2 self-end md:block" />
      </div>
    </section>
  )
}
