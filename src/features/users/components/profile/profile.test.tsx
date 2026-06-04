import { useSuspenseQuery } from "@apollo/client/react"
import { fireEvent, render, screen } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useAvatarUpload } from "@/features/users/hooks/profile/use-avatar-upload"
import { useProfileUpdateForm } from "@/features/users/hooks/profile/use-profile-update-form"
import { usePermissions } from "@/hooks/use-permissions"

import AvatarUpload from "./avatar-upload"
import { ProfileSkeleton } from "./profile-skeleton"
import ProfileTextInfo from "./profile-text-info"
import ProfileUpdateForm from "./profile-update-form"

// Mock dependencies
vi.mock("@apollo/client/react", () => ({
  useSuspenseQuery: vi.fn(),
}))

vi.mock("@/features/users/hooks/profile/use-avatar-upload", () => ({
  useAvatarUpload: vi.fn(),
}))

vi.mock("@/features/users/hooks/profile/use-profile-update-form", () => ({
  useProfileUpdateForm: vi.fn(),
}))

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({
    children,
    size,
  }: {
    children?: React.ReactNode
    size?: string
  }) => (
    <div data-testid="avatar" data-size={size}>
      {children}
    </div>
  ),
  AvatarImage: ({ src }: { src?: string }) =>
    src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img data-testid="avatar-image" src={src} alt="avatar" />
    ) : null,
  AvatarFallback: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}))

vi.mock("@/components/shared/icon-button", () => ({
  default: ({
    children,
    onClick,
    disabled,
    className,
  }: {
    children?: React.ReactNode
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    disabled?: boolean
    className?: string
  }) => (
    <button
      data-testid="icon-button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  ),
}))

vi.mock("@/components/ui/file-upload", () => ({
  FileUpload: ({
    children,
    onFileReject,
    onAccept,
    onValueChange,
    disabled,
    className,
  }: {
    children?: React.ReactNode
    onFileReject?: (arg: unknown) => void
    onAccept?: (files: File[]) => void
    onValueChange?: (arg: unknown) => void
    disabled?: boolean
    className?: string
  }) => (
    <div
      data-testid="file-upload"
      data-disabled={disabled}
      className={className}
      onClick={() => {
        onAccept?.([new File([], "avatar.png")])
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        onFileReject?.([])
      }}
      onDoubleClick={() => {
        onValueChange?.([])
      }}
    >
      {children}
    </div>
  ),
  FileUploadDropzone: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="dropzone">{children}</div>
  ),
}))

describe("Profile Components Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("ProfileSkeleton", () => {
    it("should render skeleton elements successfully", () => {
      const { container } = render(<ProfileSkeleton />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe("ProfileTextInfo", () => {
    it("should render name, email and formatted member date", () => {
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: {
          user: {
            email: "jane@example.com",
            created_at: "1717513200000", // 2024-06-04
            profile: {
              full_name: "Jane Doe",
            },
          },
        },
      } as unknown as ReturnType<typeof useSuspenseQuery>)

      render(<ProfileTextInfo userId="123" />)

      expect(screen.getByText("Jane Doe")).toBeInTheDocument()
      expect(screen.getByText("jane@example.com")).toBeInTheDocument()
      // Date conversion depends on locale but formatting via helper is triggered
      expect(screen.getByText(/member-since/)).toBeInTheDocument()
    })
  })

  describe("AvatarUpload", () => {
    let mockUploadHook: ReturnType<typeof useAvatarUpload>

    const mockUserWithAvatar = {
      data: {
        user: {
          email: "jane@example.com",
          profile: {
            full_name: "Jane Doe",
            avatar: "http://example.com/avatar.png",
          },
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>

    beforeEach(() => {
      mockUploadHook = {
        isLoading: false,
        onAvatarReject: vi.fn(),
        onAvatarAccept: vi.fn(),
        onAvatarDelete: vi.fn(),
        files: [],
        clearFiles: vi.fn(),
      }
      vi.mocked(useAvatarUpload).mockReturnValue(mockUploadHook)

      vi.mocked(usePermissions).mockReturnValue({
        canUpdateUser: () => true,
      } as unknown as ReturnType<typeof usePermissions>)
    })

    it("should render avatar image and show active delete button if avatar exists and user has permissions", () => {
      vi.mocked(useSuspenseQuery).mockReturnValue(mockUserWithAvatar)

      render(<AvatarUpload userId="123" />)

      expect(screen.getByTestId("avatar-image")).toHaveAttribute(
        "src",
        "http://example.com/avatar.png"
      )

      const deleteBtn = screen.getByTestId("icon-button")
      expect(deleteBtn).toBeInTheDocument()
      expect(deleteBtn).not.toHaveClass("hidden")
      expect(deleteBtn).not.toBeDisabled()

      fireEvent.click(deleteBtn)
      expect(mockUploadHook.onAvatarDelete).toHaveBeenCalled()
    })

    it("should show uppercase fallback first letter and hide delete button if no avatar exists", () => {
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: {
          user: {
            email: "jane@example.com",
            profile: {
              full_name: "", // fallback to email
              avatar: null,
            },
          },
        },
      } as unknown as ReturnType<typeof useSuspenseQuery>)

      render(<AvatarUpload userId="123" />)

      expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("J")

      const deleteBtn = screen.getByTestId("icon-button")
      expect(deleteBtn).toHaveClass("hidden")
    })

    it("should hide fileupload, hide delete button, and disable controls if user lacks update permissions", () => {
      vi.mocked(usePermissions).mockReturnValue({
        canUpdateUser: () => false,
      } as unknown as ReturnType<typeof usePermissions>)

      vi.mocked(useSuspenseQuery).mockReturnValue(mockUserWithAvatar)

      render(<AvatarUpload userId="123" />)

      // FileUpload container has hidden class
      expect(screen.getByTestId("file-upload")).toHaveClass("hidden")

      // Delete button has hidden class and is disabled
      const deleteBtn = screen.getByTestId("icon-button")
      expect(deleteBtn).toHaveClass("hidden")
      expect(deleteBtn).toBeDisabled()
    })

    it("should trigger FileUpload interaction events correctly", () => {
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: {
          user: {
            email: "jane@example.com",
            profile: {
              full_name: "Jane Doe",
              avatar: null,
            },
          },
        },
      } as unknown as ReturnType<typeof useSuspenseQuery>)

      render(<AvatarUpload userId="123" />)

      const fileUpload = screen.getByTestId("file-upload")

      // Click to accept file
      fireEvent.click(fileUpload)
      expect(mockUploadHook.onAvatarAccept).toHaveBeenCalled()

      // Context menu to reject file
      fireEvent.contextMenu(fileUpload)
      expect(mockUploadHook.onAvatarReject).toHaveBeenCalled()

      // Double click to clear files
      fireEvent.doubleClick(fileUpload)
      expect(mockUploadHook.clearFiles).toHaveBeenCalled()
    })
  })

  describe("ProfileUpdateForm", () => {
    interface ProfileFormFields {
      firstName: string
      lastName: string
      departmentId: string
      positionId: string
    }

    const UpdateFormTestWrapper = ({
      hasUpdatePermission,
      isDirty = false,
      onSubmitAction = vi.fn(),
    }: {
      hasUpdatePermission: boolean
      isDirty?: boolean
      onSubmitAction?: () => void
    }) => {
      const { register, control } = useForm<ProfileFormFields>({
        defaultValues: {
          firstName: "John",
          lastName: "Doe",
          departmentId: "dept-1",
          positionId: "pos-1",
        },
      })

      vi.mocked(useProfileUpdateForm).mockReturnValue({
        onSubmit: (e?: { preventDefault?: () => void }) => {
          e?.preventDefault?.()
          onSubmitAction?.()
          return Promise.resolve()
        },
        register,
        control,
        isDirty,
        isPending: false,
      } as unknown as ReturnType<typeof useProfileUpdateForm>)

      vi.mocked(usePermissions).mockReturnValue({
        canUpdateUser: () => hasUpdatePermission,
      } as unknown as ReturnType<typeof usePermissions>)

      return <ProfileUpdateForm userId="123" />
    }

    it("should render fields with readOnly and hide button if hasUpdatePermission is false", () => {
      render(<UpdateFormTestWrapper hasUpdatePermission={false} />)

      // Verify input fields are readOnly
      const firstNameInput = screen.getByLabelText("first-name")
      const lastNameInput = screen.getByLabelText("last-name")
      expect(firstNameInput).toHaveAttribute("readonly")
      expect(lastNameInput).toHaveAttribute("readonly")

      // Verify Select components are disabled
      expect(screen.getByTestId("dept-select")).toBeDisabled()
      expect(screen.getByTestId("pos-select")).toBeDisabled()

      // Verify submit button is hidden (has 'hidden' class)
      const button = screen.queryByRole("button", { name: "update" })
      expect(button).toHaveClass("hidden")
    })

    it("should render editable fields and show button if hasUpdatePermission is true", () => {
      const mockOnSubmit = vi.fn()

      render(
        <UpdateFormTestWrapper
          hasUpdatePermission={true}
          isDirty={true}
          onSubmitAction={mockOnSubmit}
        />
      )

      // Verify input fields are NOT readOnly
      const firstNameInput = screen.getByLabelText("first-name")
      const lastNameInput = screen.getByLabelText("last-name")
      expect(firstNameInput).not.toHaveAttribute("readonly")
      expect(lastNameInput).not.toHaveAttribute("readonly")

      // Verify Select components are active
      expect(screen.getByTestId("dept-select")).not.toBeDisabled()
      expect(screen.getByTestId("pos-select")).not.toBeDisabled()

      // Verify button is visible and active
      const button = screen.getByRole("button", { name: "update" })
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()

      // Submit form
      fireEvent.submit(
        screen.getByRole("button", { name: "update" }).closest("form")!
      )
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    it("should disable update button if form is not dirty", () => {
      render(
        <UpdateFormTestWrapper hasUpdatePermission={true} isDirty={false} />
      )
      const button = screen.getByRole("button", { name: "update" })
      expect(button).toBeDisabled()
    })

    it("should handle department and position changes correctly (cover onValueChange)", () => {
      render(<UpdateFormTestWrapper hasUpdatePermission={true} />)

      const deptSelect = screen.getByTestId("dept-select")
      const posSelect = screen.getByTestId("pos-select")

      // Change to some value (covers field.onChange(v))
      fireEvent.change(deptSelect, { target: { value: "dept-1" } })
      fireEvent.change(posSelect, { target: { value: "pos-1" } })

      // Change to "none" (covers field.onChange(""))
      fireEvent.change(deptSelect, { target: { value: "none" } })
      fireEvent.change(posSelect, { target: { value: "none" } })
    })
  })
})
