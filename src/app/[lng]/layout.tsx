import "@/app/globals.css"

import type { Viewport } from "next"
import { Roboto } from "next/font/google"
import { cookies } from "next/headers"
import { I18nProvider } from "next-i18next/client"
import {
  generateI18nStaticParams,
  getResources,
  getT,
  initServerI18next,
} from "next-i18next/server"

import i18nConfig from "@root/i18n.config"
import { ApolloWrapper } from "@/app/apollo-wrapper"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { COOKIES } from "@/config/const"
import { AuthProvider } from "@/features/auth/components/auth-provider"
import { decodeJwtPayload } from "@/features/auth/utils/jwt"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
})

initServerI18next(i18nConfig)

export async function generateStaticParams() {
  return generateI18nStaticParams()
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lng: string }>
}>) {
  const { lng } = await params
  const { i18n } = await getT(undefined, { lng })
  const resources = getResources(i18n)

  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIES.ACCESS_TOKEN)?.value

  let userId: string | null = null
  let role: string | null = null

  if (token) {
    const payload = decodeJwtPayload(token)
    if (payload) {
      userId = String(payload.sub) || null
      role = payload.role || null
    }
  }

  return (
    <html
      lang={lng}
      suppressHydrationWarning
      className={cn("antialiased", roboto.variable, "font-sans")}
    >
      <body>
        <I18nProvider language={lng} resources={resources}>
          <AuthProvider userId={userId} role={role}>
            <ApolloWrapper>
              <ThemeProvider>
                {children}
                <Toaster closeButton duration={3000} position={"top-right"} />
              </ThemeProvider>
            </ApolloWrapper>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
