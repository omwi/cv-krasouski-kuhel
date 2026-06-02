type Props = {
  children: React.ReactNode
  heading: string | React.ReactNode
}

export default function PreviewSection({ children, heading }: Props) {
  return (
    <section className="flex flex-col gap-6">
      {typeof heading === "string" ? (
        <h2 className="text-3xl">{heading}</h2>
      ) : (
        heading
      )}
      {children}
    </section>
  )
}
