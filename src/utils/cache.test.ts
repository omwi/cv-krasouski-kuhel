import { FieldFunctionOptions, Reference } from "@apollo/client"
import { describe, expect, it, vi } from "vitest"

import {
  appendUniqueRef,
  prependUniqueRef,
  removeRefById,
  replaceRef,
} from "@/utils/cache"

type ReadField = FieldFunctionOptions["readField"]

const makeRef = (id: string): Reference => ({ __ref: `Entity:${id}` })

const makeReadField = (idMap: Record<string, string>): ReadField =>
  ((field: string, ref: Reference) => {
    if (field === "id") return idMap[ref.__ref]
    return undefined
  }) as unknown as ReadField

const mockReadField = () => vi.fn() as unknown as ReadField

describe("appendUniqueRef", () => {
  it("should append newRef when id does not exist in list", () => {
    const ref1 = makeRef("1")
    const newRef = makeRef("2")
    const readField = makeReadField({ "Entity:1": "1", "Entity:2": "2" })

    const result = appendUniqueRef(newRef, "2")([ref1], { readField })

    expect(result).toEqual([ref1, newRef])
  })

  it("should return original list unchanged when id already exists", () => {
    const ref1 = makeRef("1")
    const duplicateRef = makeRef("1")
    const existingRefs = [ref1]
    const readField = makeReadField({ "Entity:1": "1" })

    const result = appendUniqueRef(duplicateRef, "1")(existingRefs, {
      readField,
    })

    // Returns the same array reference (early return)
    expect(result).toBe(existingRefs)
    expect(result).toEqual([ref1])
  })

  it("should use empty array as default when existingRefs is undefined", () => {
    const newRef = makeRef("42")
    const readField = mockReadField()

    const result = appendUniqueRef(newRef, "42")(undefined, { readField })

    expect(result).toEqual([newRef])
    expect(vi.mocked(readField)).not.toHaveBeenCalled()
  })

  it("should append to the end of a non-empty list", () => {
    const ref1 = makeRef("1")
    const ref2 = makeRef("2")
    const newRef = makeRef("3")
    const readField = makeReadField({
      "Entity:1": "1",
      "Entity:2": "2",
      "Entity:3": "3",
    })

    const result = appendUniqueRef(newRef, "3")([ref1, ref2], { readField })

    expect(result).toEqual([ref1, ref2, newRef])
  })
})

describe("prependUniqueRef", () => {
  it("should prepend newRef when id does not exist in list", () => {
    const ref1 = makeRef("1")
    const newRef = makeRef("2")
    const readField = makeReadField({ "Entity:1": "1", "Entity:2": "2" })

    const result = prependUniqueRef(newRef, "2")([ref1], { readField })

    expect(result).toEqual([newRef, ref1])
  })

  it("should return original list unchanged when id already exists", () => {
    const ref1 = makeRef("1")
    const duplicateRef = makeRef("1")
    const readField = makeReadField({ "Entity:1": "1" })

    const result = prependUniqueRef(duplicateRef, "1")([ref1], { readField })

    expect(result).toEqual([ref1])
  })

  it("should use empty array as default when existingRefs is undefined", () => {
    const newRef = makeRef("99")
    const readField = mockReadField()

    const result = prependUniqueRef(newRef, "99")(undefined, { readField })

    expect(result).toEqual([newRef])
    expect(vi.mocked(readField)).not.toHaveBeenCalled()
  })

  it("should prepend to the front of a non-empty list", () => {
    const ref1 = makeRef("1")
    const ref2 = makeRef("2")
    const newRef = makeRef("3")
    const readField = makeReadField({
      "Entity:1": "1",
      "Entity:2": "2",
      "Entity:3": "3",
    })

    const result = prependUniqueRef(newRef, "3")([ref1, ref2], { readField })

    expect(result).toEqual([newRef, ref1, ref2])
  })
})

describe("removeRefById", () => {
  it("should remove the ref matching the given id", () => {
    const ref1 = makeRef("1")
    const ref2 = makeRef("2")
    const ref3 = makeRef("3")
    const readField = makeReadField({
      "Entity:1": "1",
      "Entity:2": "2",
      "Entity:3": "3",
    })

    const result = removeRefById("2")([ref1, ref2, ref3], { readField })

    expect(result).toEqual([ref1, ref3])
  })

  it("should return all refs if id is not found", () => {
    const ref1 = makeRef("1")
    const ref2 = makeRef("2")
    const readField = makeReadField({ "Entity:1": "1", "Entity:2": "2" })

    const result = removeRefById("999")([ref1, ref2], { readField })

    expect(result).toEqual([ref1, ref2])
  })

  it("should return empty array when list is empty", () => {
    const readField = mockReadField()

    const result = removeRefById("1")([], { readField })

    expect(result).toEqual([])
    expect(vi.mocked(readField)).not.toHaveBeenCalled()
  })

  it("should use empty array as default when existingRefs is undefined", () => {
    const readField = mockReadField()

    const result = removeRefById("1")(undefined, { readField })

    expect(result).toEqual([])
  })

  it("should remove all refs matching the id (multiple occurrences)", () => {
    const ref1 = makeRef("1")
    const ref2a = makeRef("2")
    const ref2b = makeRef("2")
    const readField = makeReadField({ "Entity:1": "1", "Entity:2": "2" })

    const result = removeRefById("2")([ref1, ref2a, ref2b], { readField })

    expect(result).toEqual([ref1])
  })
})

describe("replaceRef", () => {
  it("should replace the ref matching the given id", () => {
    const ref1 = makeRef("1")
    const ref2 = makeRef("2")
    const newRef = makeRef("2-updated")
    const readField = makeReadField({
      "Entity:1": "1",
      "Entity:2": "2",
      "Entity:2-updated": "2",
    })

    const result = replaceRef(newRef, "2")([ref1, ref2], { readField })

    expect(result).toEqual([ref1, newRef])
  })

  it("should append newRef if id is not found in list", () => {
    const ref1 = makeRef("1")
    const newRef = makeRef("99")
    const readField = makeReadField({ "Entity:1": "1", "Entity:99": "99" })

    const result = replaceRef(newRef, "99")([ref1], { readField })

    expect(result).toEqual([ref1, newRef])
  })

  it("should use empty array as default when existingRefs is undefined", () => {
    const newRef = makeRef("5")
    const readField = mockReadField()

    const result = replaceRef(newRef, "5")(undefined, { readField })

    // Not found → appended to empty list
    expect(result).toEqual([newRef])
  })

  it("should replace only the first matching ref and append if none found", () => {
    const ref1 = makeRef("1")
    const ref3 = makeRef("3")
    const newRef = makeRef("2-new")
    const readField = makeReadField({
      "Entity:1": "1",
      "Entity:3": "3",
      "Entity:2-new": "2",
    })

    // id "2" not present — should append
    const result = replaceRef(newRef, "2")([ref1, ref3], { readField })

    expect(result).toEqual([ref1, ref3, newRef])
  })

  it("should replace ref at any position in the list", () => {
    const ref1 = makeRef("1")
    const ref2 = makeRef("2")
    const ref3 = makeRef("3")
    const newRef = makeRef("1-updated")
    const readField = makeReadField({
      "Entity:1": "1",
      "Entity:2": "2",
      "Entity:3": "3",
      "Entity:1-updated": "1",
    })

    const result = replaceRef(newRef, "1")([ref1, ref2, ref3], { readField })

    expect(result).toEqual([newRef, ref2, ref3])
  })
})
