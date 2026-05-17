export interface HeaderLink {
  href: string
  labelKey: string
}

export interface TabHeaderProps {
  i18nNamespace: string
  links: HeaderLink[]
}

export interface SliderProps {
  links: HeaderLink[]
  linkRefs: React.RefObject<(HTMLAnchorElement | null)[]>
  navRef: React.RefObject<HTMLElement | null>
}
