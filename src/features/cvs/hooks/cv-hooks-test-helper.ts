import * as rhf from "react-hook-form"
import { expect } from "vitest"

interface FormStateMock {
  isDirty: boolean
  isValid: boolean
}

export function verifyIsSubmitReadyCombinations(
  result: { current: { isSubmitReady: boolean } },
  rerender: () => void,
  mockFormState: FormStateMock
) {
  mockFormState.isDirty = false
  mockFormState.isValid = false
  rerender()
  expect(result.current.isSubmitReady).toBe(false)

  mockFormState.isDirty = true
  mockFormState.isValid = false
  rerender()
  expect(result.current.isSubmitReady).toBe(false)

  mockFormState.isDirty = false
  mockFormState.isValid = true
  rerender()
  expect(result.current.isSubmitReady).toBe(false)

  mockFormState.isDirty = true
  mockFormState.isValid = true
  rerender()
  expect(result.current.isSubmitReady).toBe(true)
}

export function createMockUseForm(
  originalUseForm: typeof rhf.useForm,
  mockFormState:
    | { isDirty: boolean; isValid: boolean }
    | (() => { isDirty: boolean; isValid: boolean })
    | null,
  submitData: rhf.FieldValues | (() => rhf.FieldValues),
  extra?: Record<string, unknown> | (() => Record<string, unknown>)
) {
  return (args: unknown) => {
    const form = originalUseForm(args as rhf.UseFormProps<rhf.FieldValues>)
    const resolvedFormState =
      typeof mockFormState === "function" ? mockFormState() : mockFormState
    const resolvedSubmitData =
      typeof submitData === "function" ? submitData() : submitData
    const resolvedExtra = typeof extra === "function" ? extra() : extra
    return {
      ...form,
      ...(resolvedFormState ? { formState: resolvedFormState } : {}),
      handleSubmit: (
        onValid: (
          data: rhf.FieldValues,
          event?: React.BaseSyntheticEvent
        ) => unknown
      ) => {
        return async () => {
          await onValid(resolvedSubmitData)
        }
      },
      ...resolvedExtra,
    }
  }
}
