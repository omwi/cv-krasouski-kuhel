export const convertId = (
  val: string | null | undefined
): number | string | null => {
  if (!val) return null
  if (/^\d+$/.test(val)) {
    return parseInt(val, 10)
  }
  return val
}
