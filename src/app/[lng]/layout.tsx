import { Roboto } from "next/font/google"
import {
  initServerI18next,
  getT,
  getResources,
  generateI18nStaticParams,
} from "next-i18next/server"
import { I18nProvider } from "next-i18next/client"

import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import i18nConfig from "@root/i18n.config"
import { ApolloWrapper } from "@/app/ApolloWrapper"

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
