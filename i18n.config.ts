import type { I18nConfig } from "next-i18next/proxy"

const i18nConfig: I18nConfig = {
  supportedLngs: ["en", "ru"],
  fallbackLng: "en",
  defaultNS: "common",
  ns: [
    "common",
    "auth",
    "metadata",
    "nav",
    "users",
    "buttons",
    "settings",
    "user-profile",
    "user-actions",
    "position-actions",
    "department-actions",
    "project-actions",
    "skill-actions",
    "language-actions",
    "project-details",
    "cv-actions",
    "cv-project-actions",
    "input",
    "delete",
    "table",
    "skills",
    "languages",
  ],
  localeInPath: true,
  hideDefaultLocale: true,
  resourceLoader:
    process.env.NODE_ENV === "development"
      ? async (lng, ns) => {
          const [fs, path] = await Promise.all([
            import("fs/promises"),
            import("path"),
          ])
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
