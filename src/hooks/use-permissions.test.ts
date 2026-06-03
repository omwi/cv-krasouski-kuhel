import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useAuthContext } from "@/features/auth/components/auth-provider"
import { usePermissions } from "@/hooks/use-permissions"

vi.mock("@/features/auth/components/auth-provider", () => ({
  useAuthContext: vi.fn(),
}))

const mockedUseAuthContext = vi.mocked(useAuthContext)

type AuthContextType = ReturnType<typeof useAuthContext>

const admin = {
  userId: "1",
  role: "Admin",
}

const employee = {
  userId: "2",
  role: "Employee",
}

const guest = {
  userId: null,
  role: null,
}

describe("usePermissions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("admin user", () => {
    beforeEach(() => {
      mockedUseAuthContext.mockReturnValue(admin)
    })

    it("should allow creating users", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canCreateUser()).toBe(true)
    })

    it("should allow updating any user", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canUpdateUser(admin.userId)).toBe(true)
      expect(result.current.canUpdateUser(employee.userId)).toBe(true)
    })

    it("should not allow deleting itself", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canDeleteUser(admin.userId)).toBe(false)
    })

    it("should allow deleting other users", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canDeleteUser(employee.userId)).toBe(true)
    })

    it("should allow all CV actions", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canCreateCv()).toBe(true)
      expect(result.current.canCreateCv(admin.userId)).toBe(true)
      expect(result.current.canCreateCv(employee.userId)).toBe(true)

      expect(result.current.canUpdateCv()).toBe(true)
      expect(result.current.canUpdateCv(admin.userId)).toBe(true)
      expect(result.current.canUpdateCv(employee.userId)).toBe(true)

      expect(result.current.canDeleteCv()).toBe(true)
      expect(result.current.canDeleteCv(admin.userId)).toBe(true)
      expect(result.current.canDeleteCv(employee.userId)).toBe(true)
    })

    it("should allow all project actions", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canCreateProject()).toBe(true)
      expect(result.current.canUpdateProject()).toBe(true)
      expect(result.current.canDeleteProject()).toBe(true)
    })
  })

  describe("employee user", () => {
    beforeEach(() => {
      mockedUseAuthContext.mockReturnValue(employee)
    })

    it("should not allow creating users", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canCreateUser()).toBe(false)
    })

    it("should allow updating itself only", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canUpdateUser(employee.userId)).toBe(true)
      expect(result.current.canUpdateUser(admin.userId)).toBe(false)
    })

    it("should not allow deleting users", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canDeleteUser(employee.userId)).toBe(false)
      expect(result.current.canDeleteUser(admin.userId)).toBe(false)
    })

    it("should allow creating CVs only for itself", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canCreateCv()).toBe(true)
      expect(result.current.canCreateCv(employee.userId)).toBe(true)
      expect(result.current.canCreateCv(admin.userId)).toBe(false)
    })

    it("should allow updating CVs only for itself", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canUpdateCv()).toBe(false)
      expect(result.current.canUpdateCv(employee.userId)).toBe(true)
      expect(result.current.canUpdateCv(admin.userId)).toBe(false)
    })

    it("should allow deleting CVs only for itself", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canDeleteCv()).toBe(false)
      expect(result.current.canDeleteCv(employee.userId)).toBe(true)
      expect(result.current.canDeleteCv(admin.userId)).toBe(false)
    })

    it("should not allow project actions", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canCreateProject()).toBe(false)
      expect(result.current.canUpdateProject()).toBe(false)
      expect(result.current.canDeleteProject()).toBe(false)
    })
  })

  describe("guest user", () => {
    beforeEach(() => {
      mockedUseAuthContext.mockReturnValue(guest)
    })

    it("should not allow users actions", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canCreateUser()).toBe(false)
      expect(result.current.canUpdateUser(employee.userId)).toBe(false)
      expect(result.current.canDeleteUser(employee.userId)).toBe(false)
    })

    it("should not allow CV actions", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canCreateCv()).toBe(false)
      expect(result.current.canUpdateCv()).toBe(false)
      expect(result.current.canDeleteCv()).toBe(false)

      expect(result.current.canCreateCv(employee.userId)).toBe(false)
      expect(result.current.canUpdateCv(employee.userId)).toBe(false)
      expect(result.current.canDeleteCv(employee.userId)).toBe(false)
    })

    it("should not allow project actions", () => {
      const { result } = renderHook(() => usePermissions())

      expect(result.current.canCreateProject()).toBe(false)
      expect(result.current.canUpdateProject()).toBe(false)
      expect(result.current.canDeleteProject()).toBe(false)
    })
  })
})
