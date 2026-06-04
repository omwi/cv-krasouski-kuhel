import "@testing-library/jest-dom/vitest"

import { vi } from "vitest"

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      refresh: vi.fn(),
    }
  },
  usePathname() {
    return ""
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  useParams() {
    return {}
  },
}))

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string, options?: { date?: string | number | null }) => {
      if (options?.date) {
        return `${key}:${options.date}`
      }
      return key
    },
    i18n: {
      language: "en",
    },
  }),
}))

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}))

vi.mock("@/components/shared/dialog/form-dialog")
vi.mock("@/components/shared/dialog/delete-dialog")
vi.mock("@/features/departments/components/department-select")
vi.mock("@/features/positions/components/position-select")
vi.mock("@/components/shared/select/role-select")

vi.mock("@/hooks/use-permissions", () => ({
  usePermissions: vi.fn(),
}))
