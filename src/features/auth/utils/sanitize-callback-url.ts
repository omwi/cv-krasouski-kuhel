import { paths } from "@/config/paths"

export function sanitizeCallbackUrl(
  url: string | null,
  fallback: string = paths.users.get()
): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) return fallback
  try {
    new URL(url, "http://x")
    return url
  } catch {
    return fallback
  }
}
