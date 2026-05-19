import Link from "next/link"

type Props = React.PropsWithChildren & {
  to: string
}

export default function ActionLink({ to, children }: Props) {
  return (
    <Link
      href={to}
      className="flex flex-row items-center gap-2 px-4 py-1.5 hover:bg-nav-hover"
    >
      {children}
    </Link>
  )
}
