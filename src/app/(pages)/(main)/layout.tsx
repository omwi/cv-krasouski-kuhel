import SideNav from "@/components/layout/side-nav"

type Props = {
  children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-dvh flex-col-reverse overflow-hidden md:flex-row">
      <SideNav />
      <main className="flex flex-1 overflow-hidden px-6">{children}</main>
    </div>
  )
}
