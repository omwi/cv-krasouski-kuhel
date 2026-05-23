const crumbI18Keys: Record<string, string | undefined> = {
  users: "employees",
  skills: "skills",
  languages: "languages",
  cvs: "cvs",
  projects: "projects",
  departments: "departments",
  positions: "positions",
  settings: "settings",
  profile: "profile",
}

export function getCrumbI18Key(part: string): string {
  const key = crumbI18Keys[part]
  if (!key) throw new Error(`Couldnt find i18 key for ${part} breadcrumb`)
  return key
}
