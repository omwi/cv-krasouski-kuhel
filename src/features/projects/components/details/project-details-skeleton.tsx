import { Skeleton } from "@/components/ui/skeleton"

export function ProjectDetailsSkeleton() {
  return (
    <section className="flex w-full max-w-3xl flex-col gap-8 py-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-64 md:w-96" />
      </div>

      <div className="flex justify-between gap-8">
        <div className="flex flex-col gap-2">
          <Skeleton className="mb-2 h-7 w-36" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="mb-2 h-7 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="mb-2 h-7 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="mb-2 h-7 w-36" />
        <div className="flex items-center justify-between gap-8 max-sm:flex-col max-sm:items-start max-sm:gap-4">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Skeleton className="h-6 w-20 rounded-full" />
            </li>
            <li>
              <Skeleton className="h-6 w-16 rounded-full" />
            </li>
            <li>
              <Skeleton className="h-6 w-24 rounded-full" />
            </li>
          </ul>

          <Skeleton className="h-10 w-24 shrink-0 rounded-md" />
        </div>
      </div>
    </section>
  )
}
