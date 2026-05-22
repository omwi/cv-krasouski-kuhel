"use client"

import { useState } from "react"
import { Globe, Laptop, Moon, Sun } from "lucide-react"
import { useChangeLanguage, useT } from "next-i18next/client"
import { useTheme } from "next-themes"

import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import {
  resetLanguageCookie,
  setLanguageCookie,
} from "@/features/settings/actions"

export default function SettingsForm({ initialLang }: { initialLang: string }) {
  const { t, i18n } = useT("settings")
  const { theme, setTheme } = useTheme()
  const changeLanguage = useChangeLanguage()

  const [activeLang, setActiveLang] = useState(initialLang)
  const [isChanging, setIsChanging] = useState(false)

  const handleLanguageChange = async (value: string) => {
    setIsChanging(true)
    try {
      if (value === "system") {
        await resetLanguageCookie()
        setActiveLang("system")
        window.location.reload()
      } else {
        await setLanguageCookie(value)
        setActiveLang(value)
        await changeLanguage(value)
      }
    } finally {
      setIsChanging(false)
    }
  }

  const supportedLanguages = (i18n.options.supportedLngs || []).filter(
    (lng): lng is string => lng !== "cimode"
  )

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <FloatingSelect
        id="theme-select"
        label={t("theme.label")}
        value={theme || "system"}
        onValueChange={setTheme}
      >
        <SelectItem value="system">
          <span className="flex items-center gap-2">
            <Laptop size={16} />
            {t("theme.system")}
          </span>
        </SelectItem>
        <SelectItem value="light">
          <span className="flex items-center gap-2">
            <Sun size={16} />
            {t("theme.light")}
          </span>
        </SelectItem>
        <SelectItem value="dark">
          <span className="flex items-center gap-2">
            <Moon size={16} />
            {t("theme.dark")}
          </span>
        </SelectItem>
      </FloatingSelect>

      <FloatingSelect
        id="language-select"
        label={t("language.label")}
        value={activeLang}
        onValueChange={handleLanguageChange}
        disabled={isChanging}
      >
        <SelectItem value="system">
          <span className="flex items-center gap-2">
            <Laptop size={16} />
            {t("language.system")}
          </span>
        </SelectItem>
        {supportedLanguages.map((lng) => (
          <SelectItem key={lng} value={lng}>
            <span className="flex items-center gap-2">
              <Globe size={16} />
              {t(`language.${lng}`)}
            </span>
          </SelectItem>
        ))}
      </FloatingSelect>
    </div>
  )
}
