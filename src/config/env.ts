import "dotenv/config"

export const env = {
  IS_PROD: process.env.NODE_ENV === "production",
}
