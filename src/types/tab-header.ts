export type HeaderLink = {
  href: string
  labelKey: string
}

export type TabHeaderProps = {
  i18nNamespace: string
  links: HeaderLink[]
}

export type SliderProps = {
  links: HeaderLink[]
  linkRefs: React.RefObject<(HTMLAnchorElement | null)[]>
  navRef: React.RefObject<HTMLElement | null>
}
