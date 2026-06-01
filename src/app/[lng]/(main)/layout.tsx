import CrumbsNav from "@/components/layout/crumbs/crumbs-nav"
import SideNav from "@/components/layout/sidebar/side-nav"

type Props = {
  children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-dvh flex-col-reverse md:flex-row">
      <SideNav />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto px-6 pt-4">
        <header>
          <CrumbsNav />
        </header>
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
