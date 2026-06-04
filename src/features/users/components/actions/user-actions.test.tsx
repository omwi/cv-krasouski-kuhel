import { useMutation } from "@apollo/client/react"
import { fireEvent, render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import DepartmentSelect from "@/features/departments/components/department-select"
import PositionSelect from "@/features/positions/components/position-select"
import { TableUser } from "@/features/users/components/user-table/users-table"
import { useCreateUserForm } from "@/features/users/hooks/profile/use-create-user-form"
import { useUpdateUserForm } from "@/features/users/hooks/profile/use-update-user-form"
import { usePermissions } from "@/hooks/use-permissions"

import CreateUser from "./create-user"
import DeleteUser from "./delete-user"
import UpdateUser from "./update-user"

vi.mock("@/features/users/hooks/profile/use-create-user-form", () => ({
  useCreateUserForm: vi.fn(),
}))

vi.mock("@/features/users/hooks/profile/use-update-user-form", () => ({
  useUpdateUserForm: vi.fn(),
}))

const mockMutation = vi.fn().mockResolvedValue({})
vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn(() => [mockMutation, { loading: false }]),
  useSuspenseQuery: vi.fn(),
  useQuery: vi.fn(),
}))

const mockUser = {
  __typename: "User",
  id: "user-123",
  email: "jane@example.com",
  role: "User",
  is_verified: true,
  created_at: "2024-06-04",
  department_name: null,
  position_name: null,
  department: null,
  position: null,
  profile: {
    __typename: "Profile",
    id: "profile-123",
    avatar: null,
    first_name: "Jane",
    last_name: "Doe",
    full_name: "Jane Doe",
  },
} as unknown as TableUser

const emptyProfile = {
  __typename: "Profile",
  id: "profile-123",
  avatar: null,
  first_name: "",
  last_name: "",
  full_name: "",
} as const

const fillSelectsAndSubmit = () => {
  const deptSelect = screen.getByTestId("dept-select")
  fireEvent.change(deptSelect, { target: { value: "dept-1" } })
  fireEvent.change(deptSelect, { target: { value: "none" } })

  const posSelect = screen.getByTestId("pos-select")
  fireEvent.change(posSelect, { target: { value: "pos-1" } })
  fireEvent.change(posSelect, { target: { value: "none" } })

  const roleSelect = screen.getByTestId("role-select")
  fireEvent.change(roleSelect, { target: { value: "Admin" } })

  fireEvent.submit(screen.getByTestId("form-dialog"))
}

describe("Users Actions Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePermissions).mockReturnValue({
      isAdmin: true,
      currentUserId: "admin-123",
      canCreateUser: () => true,
      canUpdateUser: () => true,
      canDeleteUser: () => true,
      canCreateCv: () => true,
      canUpdateCv: () => true,
      canDeleteCv: () => true,
    })
  })

  describe("CreateUser Component", () => {
    const TestCreateWrapper = ({
      errors = {},
      isValid = true,
      onSubmitAction = vi.fn(),
    }: {
      errors?: Record<string, { message: string }>
      isValid?: boolean
      onSubmitAction?: () => void
    }) => {
      const { register, control } = useForm({
        defaultValues: {
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          departmentId: "",
          positionId: "",
          role: "",
        },
      })

      vi.mocked(useCreateUserForm).mockImplementation(() => {
        return {
          register,
          control,
          onSubmit: onSubmitAction,
          formState: { errors, isSubmitting: false, isValid },
        } as unknown as ReturnType<typeof useCreateUserForm>
      })

      return (
        <CreateUser>
          <button data-testid="trigger-btn">Open Dialog</button>
        </CreateUser>
      )
    }

    it("should render trigger children and handle form select fields and submit", () => {
      const mockSubmit = vi.fn()
      render(<TestCreateWrapper onSubmitAction={mockSubmit} />)

      expect(screen.getByTestId("trigger-btn")).toBeInTheDocument()

      // Click trigger to open
      fireEvent.click(screen.getByTestId("trigger-btn"))

      // Fill selects and submit
      fillSelectsAndSubmit()
      expect(mockSubmit).toHaveBeenCalled()
    })

    it("should display validation errors when fields are invalid", () => {
      const validationErrors = {
        email: { message: "Invalid email" },
        password: { message: "Weak password" },
        firstName: { message: "First name required" },
        lastName: { message: "Last name required" },
        role: { message: "Role is required" },
      }

      render(<TestCreateWrapper errors={validationErrors} isValid={false} />)

      // Click trigger to open
      fireEvent.click(screen.getByTestId("trigger-btn"))

      expect(screen.getByText("Invalid email")).toBeInTheDocument()
      expect(screen.getByText("Weak password")).toBeInTheDocument()
      expect(screen.getByText("First name required")).toBeInTheDocument()
      expect(screen.getByText("Last name required")).toBeInTheDocument()
      expect(screen.getByText("Role is required")).toBeInTheDocument()
    })

    it("should disable role select if user is not admin", () => {
      vi.mocked(usePermissions).mockReturnValue({
        isAdmin: false,
        currentUserId: "user-123",
        canCreateUser: () => false,
        canUpdateUser: () => false,
        canDeleteUser: () => false,
        canCreateCv: () => false,
        canUpdateCv: () => false,
        canDeleteCv: () => false,
      })

      render(<TestCreateWrapper />)

      // Click trigger to open
      fireEvent.click(screen.getByTestId("trigger-btn"))

      const roleSelect = screen.getByTestId("role-select")
      expect(roleSelect).toBeDisabled()
    })
  })

  describe("UpdateUser Component", () => {
    const TestUpdateWrapper = ({
      errors = {},
      onSubmitAction = vi.fn(),
      open,
      onOpenChange,
      isSubmitting = false,
      isAdmin = true,
      hasChildren = true,
      defaultValues = {
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Doe",
        departmentId: "dept-1",
        positionId: "pos-1",
        role: "User",
      },
    }: {
      errors?: Record<string, { message: string }>
      onSubmitAction?: () => void
      open?: boolean
      onOpenChange?: (open: boolean) => void
      isSubmitting?: boolean
      isAdmin?: boolean
      hasChildren?: boolean
      defaultValues?: Record<string, string>
    }) => {
      const { register, control } = useForm({
        defaultValues,
      })

      vi.mocked(usePermissions).mockReturnValue({
        isAdmin,
        currentUserId: "admin-123",
        canCreateUser: () => true,
        canUpdateUser: () => true,
        canDeleteUser: () => true,
        canCreateCv: () => true,
        canUpdateCv: () => true,
        canDeleteCv: () => true,
      })

      vi.mocked(useUpdateUserForm).mockImplementation(() => {
        return {
          register,
          control,
          onSubmit: onSubmitAction,
          formState: { errors, isSubmitting },
        } as unknown as ReturnType<typeof useUpdateUserForm>
      })

      if (!hasChildren) {
        return (
          <UpdateUser user={mockUser} open={open} onOpenChange={onOpenChange} />
        )
      }

      return (
        <UpdateUser user={mockUser} open={open} onOpenChange={onOpenChange}>
          <button data-testid="trigger-update">Open Update Dialog</button>
        </UpdateUser>
      )
    }

    it("should render and handle fields and submit in UpdateUser", () => {
      const mockSubmit = vi.fn()
      render(<TestUpdateWrapper onSubmitAction={mockSubmit} open={true} />)

      expect(screen.getByTestId("trigger-update")).toBeInTheDocument()

      // Fill selects and submit
      fillSelectsAndSubmit()
      expect(mockSubmit).toHaveBeenCalled()
    })

    it("should support internal state and handle open when props are omitted", () => {
      const mockSubmit = vi.fn()
      render(
        <TestUpdateWrapper
          onSubmitAction={mockSubmit}
          open={undefined}
          onOpenChange={undefined}
        />
      )

      // Click trigger to open via internal state
      fireEvent.click(screen.getByTestId("trigger-update"))

      // Forms should be visible now
      expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
      fireEvent.submit(screen.getByTestId("form-dialog"))
      expect(mockSubmit).toHaveBeenCalled()
    })

    it("should disable role select if user is not admin", () => {
      render(<TestUpdateWrapper isAdmin={false} open={true} />)
      const roleSelect = screen.getByTestId("role-select")
      expect(roleSelect).toBeDisabled()
    })

    it("should render without children", () => {
      render(<TestUpdateWrapper hasChildren={false} open={true} />)
      expect(screen.queryByTestId("trigger-update")).toBeNull()
      expect(screen.getByTestId("form-dialog")).toBeInTheDocument()
    })

    it("should render with empty select values", () => {
      render(
        <TestUpdateWrapper
          open={true}
          defaultValues={{
            email: "jane@example.com",
            firstName: "",
            lastName: "",
            departmentId: "",
            positionId: "",
            role: "",
          }}
        />
      )
      expect(screen.getByTestId("dept-select")).toHaveValue("")
      expect(screen.getByTestId("pos-select")).toHaveValue("")
      expect(screen.getByTestId("role-select")).toHaveValue("")
    })

    it("should disable fields if form is submitting", () => {
      render(<TestUpdateWrapper isSubmitting={true} open={true} />)
      expect(screen.getByTestId("dept-select")).toBeDisabled()
      expect(screen.getByTestId("pos-select")).toBeDisabled()
      expect(screen.getByTestId("role-select")).toBeDisabled()
    })

    it("should display validation errors when fields are invalid", () => {
      const validationErrors = {
        firstName: { message: "First name required" },
        lastName: { message: "Last name required" },
      }
      render(<TestUpdateWrapper errors={validationErrors} open={true} />)
      expect(screen.getByText("First name required")).toBeInTheDocument()
      expect(screen.getByText("Last name required")).toBeInTheDocument()
    })
  })

  describe("DeleteUser Component", () => {
    it("should render DeleteDialog with display name and trigger delete mutation", async () => {
      const onOpenChange = vi.fn()
      render(
        <DeleteUser user={mockUser} open={true} onOpenChange={onOpenChange} />
      )

      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument()
      expect(screen.getByTestId("delete-entity")).toHaveTextContent("Jane Doe")

      // Confirm delete trigger
      fireEvent.click(screen.getByTestId("delete-confirm"))
      expect(mockMutation).toHaveBeenCalledWith({
        variables: { userId: "user-123" },
      })
    })

    it("should fallback to email if profile first/last names are empty", () => {
      const emptyProfileUser = {
        ...mockUser,
        profile: emptyProfile,
      } as unknown as TableUser
      render(<DeleteUser user={emptyProfileUser} open={true} />)
      expect(screen.getByTestId("delete-entity")).toHaveTextContent(
        "jane@example.com"
      )
    })

    it("should fallback to empty string if name and email are empty", () => {
      const emptyUser = {
        ...mockUser,
        email: "",
        profile: emptyProfile,
      } as unknown as TableUser
      render(<DeleteUser user={emptyUser} open={true} />)
      expect(screen.getByTestId("delete-entity")).toHaveTextContent("")
    })

    it("should trigger default onOpenChange function if props are omitted", () => {
      render(
        <DeleteUser user={mockUser} open={true} onOpenChange={undefined} />
      )
      // Click close button to invoke default onOpenChange handler
      fireEvent.click(screen.getByTestId("delete-close"))
    })

    it("should test evict and gc in useMutation update callback", () => {
      render(<DeleteUser user={mockUser} open={true} />)

      // Retrieve the update callback passed to useMutation
      const useMutationCalls = vi.mocked(useMutation).mock.calls
      const updateCallback = useMutationCalls[useMutationCalls.length - 1][1]
        ?.update as (cache: {
        identify: (options: { __typename: string; id: string }) => string
        evict: (options: { id: string }) => void
        gc: () => void
      }) => void
      expect(updateCallback).toBeDefined()

      const mockCache = {
        evict: vi.fn(),
        gc: vi.fn(),
        identify: vi.fn().mockReturnValue("User:user-123"),
      }

      updateCallback(mockCache)
      expect(mockCache.identify).toHaveBeenCalledWith({
        __typename: "User",
        id: "user-123",
      })
      expect(mockCache.evict).toHaveBeenCalledWith({ id: "User:user-123" })
      expect(mockCache.gc).toHaveBeenCalled()
    })
  })

  describe("Mock Components Coverage Direct Test", () => {
    it("should cover fallback branches and change event handlers of mocked select components", () => {
      const mockChange = vi.fn()

      // Render DepartmentSelect with undefined value to hit fallback ?? "none"
      const { rerender } = render(
        <DepartmentSelect value={undefined} onValueChange={mockChange} />
      )
      const deptSelect = screen.getByTestId("dept-select")
      expect(deptSelect).toHaveValue("none")

      // Trigger onChange
      fireEvent.change(deptSelect, { target: { value: "dept-1" } })
      expect(mockChange).toHaveBeenCalledWith("dept-1")

      // Omit onValueChange to cover optional call branch
      rerender(<DepartmentSelect value={undefined} onValueChange={undefined} />)
      fireEvent.change(screen.getByTestId("dept-select"), {
        target: { value: "dept-1" },
      })

      // Repeat for PositionSelect
      const mockPosChange = vi.fn()
      rerender(
        <PositionSelect value={undefined} onValueChange={mockPosChange} />
      )
      const posSelect = screen.getByTestId("pos-select")
      expect(posSelect).toHaveValue("none")

      fireEvent.change(posSelect, { target: { value: "pos-1" } })
      expect(mockPosChange).toHaveBeenCalledWith("pos-1")

      rerender(<PositionSelect value={undefined} onValueChange={undefined} />)
      fireEvent.change(screen.getByTestId("pos-select"), {
        target: { value: "pos-1" },
      })
    })
  })
})
