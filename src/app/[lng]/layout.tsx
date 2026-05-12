import { Roboto } from "next/font/google"
import { I18nProvider } from "next-i18next/client"
import {
  generateI18nStaticParams,
  getResources,
  getT,
  initServerI18next,
} from "next-i18next/server"

import "@/app/globals.css"

import i18nConfig from "@root/i18n.config"
import { ApolloWrapper } from "@/app/ApolloWrapper"
import { ThemeProvider } from "@/components/theme-provider"
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
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lng: string }>
}>) {
  const { lng } = await params
  const { i18n } = await getT()
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
            <ThemeProvider>{children}</ThemeProvider>
          </ApolloWrapper>
        </I18nProvider>
      </body>
    </html>
  )
}
