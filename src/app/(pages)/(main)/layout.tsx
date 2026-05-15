import SideNav from "@/components/layout/side-nav"

type Props = React.PropsWithChildren

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-dvh flex-col-reverse md:flex-row">
      <SideNav />
      <main className="flex-1 px-6 md:overflow-y-auto">{children}</main>
    </div>
  )
}
