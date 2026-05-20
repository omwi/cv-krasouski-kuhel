import type { I18nConfig } from "next-i18next/proxy"

const i18nConfig: I18nConfig = {
  supportedLngs: ["en", "ru"],
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "auth", "metadata", "nav", "user-table"],
  localeInPath: false,
  resourceLoader:
    process.env.NODE_ENV === "development"
      ? async (lng, ns) => {
          const fs = await import("fs/promises")
          const path = await import("path")
          const content = await fs.readFile(
            path.resolve(
              process.cwd(),
              `src/app/i18n/locales/${lng}/${ns}.json`
            ),
            "utf-8"
          )
          return JSON.parse(content)
        }
      : (lng, ns) => import(`./src/app/i18n/locales/${lng}/${ns}.json`),
  reloadOnPrerender: process.env.NODE_ENV === "development",
}

export default i18nConfig
