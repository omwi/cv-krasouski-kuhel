type Props = {
  children: React.ReactNode
  heading: string
  subHeading?: string
}

export default function PreviewSection({
  children,
  heading,
  subHeading,
}: Props) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl">{heading}</h2>
        {subHeading && <h3>{subHeading}</h3>}
      </div>
      {children}
    </section>
  )
}
