import { serverEnv } from "./src/config/env.server.ts"

const config = {
  schema: serverEnv.API_URL,
  documents: ["src/**/*.{ts,tsx}"],
}

export default config
