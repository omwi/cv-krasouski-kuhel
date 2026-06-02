import { cn } from "@/lib/utils"

type Props = {
  heading: string
  variant?: "default" | "primary"
  content: string[] | string
  isList?: boolean
}

export default function SectionGroup({
  heading,
  content,
  variant = "default",
  isList = false,
}: Props) {
  return (
    <section className="flex flex-col gap-1">
      <h3
        className={cn("font-semibold", variant === "primary" && "text-primary")}
      >
        {heading}
      </h3>
      {isList ? (
        <ul className="list-disc pl-4">
          {typeof content === "string" ? (
            <li className="marker:text-primary">{content}</li>
          ) : (
            content.map((c) => (
              <li key={c} className="marker:text-primary">
                {c}
              </li>
            ))
          )}
        </ul>
      ) : (
        <p>{typeof content === "string" ? content : content.join(", ")}</p>
      )}
    </section>
  )
}
