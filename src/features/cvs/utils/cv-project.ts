export function splitResponsibilities(responsibilities: string) {
  return responsibilities
    .split("\n\n")
    .map((r) => r.trim())
    .filter((r) => r.length > 0)
}

export function joinResponsibilities(responsibilities: string[]) {
  return responsibilities.join("\n\n")
}
