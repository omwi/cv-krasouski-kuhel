import * as z from "zod"

const createEnv = () => {
  const envSchema = z.object({
    API_URL: z.url(),
  })
  const envVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  }

  const parsedEnv = envSchema.safeParse(envVars)

  if (!parsedEnv.success) {
    const errorLines = z.prettifyError(parsedEnv.error)
    throw new Error(`Invalid env provided:\n${errorLines}`)
  }

  return parsedEnv.data
}

export const env = createEnv()
