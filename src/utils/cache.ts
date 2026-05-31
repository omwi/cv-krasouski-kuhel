import { FieldFunctionOptions, Reference } from "@apollo/client"

type ModifierOptions = Pick<FieldFunctionOptions, "readField">

export function appendUniqueRef(newRef: Reference, id: string) {
  return (
    existingRefs: readonly Reference[] = [],
    { readField }: ModifierOptions
  ) => {
    const exists = existingRefs.some((ref) => readField("id", ref) === id)

    if (exists) {
      return existingRefs
    }

    return [...existingRefs, newRef]
  }
}

export function prependUniqueRef(newRef: Reference, id: string) {
  return (
    existingRefs: readonly Reference[] = [],
    { readField }: ModifierOptions
  ) => {
    const exists = existingRefs.some((ref) => readField("id", ref) === id)

    if (exists) {
      return existingRefs
    }

    return [newRef, ...existingRefs]
  }
}

export function removeRefById(id: string) {
  return (
    existingRefs: readonly Reference[] = [],
    { readField }: ModifierOptions
  ) => {
    return existingRefs.filter((ref) => readField("id", ref) !== id)
  }
}

export function replaceRef(newRef: Reference, id: string) {
  return (
    existingRefs: readonly Reference[] = [],
    { readField }: ModifierOptions
  ) => {
    let found = false

    const refs = existingRefs.map((ref) => {
      if (readField("id", ref) === id) {
        found = true
        return newRef
      }

      return ref
    })

    return found ? refs : [...refs, newRef]
  }
}
