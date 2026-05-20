import CrumbsNav from "@/components/layout/crumbs-nav"
import SideNav from "@/components/layout/side-nav"

type Props = {
  children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-dvh flex-col-reverse md:flex-row">
      <SideNav />
      <div className="flex flex-1 flex-col px-6 md:overflow-y-auto">
        <header className="pt-4 pl-5">
          <CrumbsNav />
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}
