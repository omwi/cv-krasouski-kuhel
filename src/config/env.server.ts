import * as z from "zod"

const createServerEnv = () => {
  const schema = z.object({
    API_URL: z.url(),
  })

  const parsed = schema.safeParse({
    API_URL: process.env.API_URL,
  })

  if (!parsed.success) {
    const errorLines = z.prettifyError(parsed.error)
    throw new Error(`Invalid server env:\n${errorLines}`)
  }

  return parsed.data
}

export const serverEnv = createServerEnv()
