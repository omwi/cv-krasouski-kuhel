import "@/app/globals.css"

import { Roboto } from "next/font/google"
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
import { AuthInitializer } from "@/features/auth/components/auth-initializer"
import { cn } from "@/lib/utils"

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
}: Readonly<{ children: React.ReactNode }>) {
  const { i18n, lng } = await getT()
  const resources = getResources(i18n)

  return (
    <html
      lang={lng}
      suppressHydrationWarning
      className={cn("antialiased", roboto.variable, "font-sans")}
    >
      <body>
        <I18nProvider language={lng} resources={resources}>
          <ApolloWrapper>
            <AuthInitializer />
            <ThemeProvider>
              {children}
              <Toaster closeButton duration={3000} position={"top-right"} />
            </ThemeProvider>
          </ApolloWrapper>
        </I18nProvider>
      </body>
    </html>
  )
}
