import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { fileToBase64 } from "@/utils/file"

import { useAvatarUpload } from "../use-avatar-upload"

vi.mock("@/utils/file", () => ({
  fileToBase64: vi.fn().mockResolvedValue("base64-data"),
}))

interface MockCache {
  identify: (obj: {
    __typename?: string
    id?: string
    __ref?: string
  }) => string
  modify: (options: {
    id: string
    fields: Record<string, (ref: { __ref?: string } | null) => unknown>
  }) => void
}

type CacheUpdateFn = (
  cache: MockCache,
  options?: { data?: { uploadAvatar?: string } | null }
) => void

const mocks = vi.hoisted(() => ({
  upload: vi.fn(),
  delete: vi.fn(),
  updates: [] as CacheUpdateFn[],
  callCount: 0,
}))

vi.mock("@apollo/client/react", () => ({
  useMutation: vi.fn((mutation, options) => {
    if (options?.update) {
      mocks.updates.push(options.update)
    }
    mocks.callCount++
    if (mocks.callCount % 2 === 1) {
      return [mocks.upload, { loading: false }]
    }
    return [mocks.delete, { loading: false }]
  }),
}))

describe("useAvatarUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.callCount = 0
    mocks.updates = []
    mocks.upload.mockResolvedValue({ data: { uploadAvatar: "http://url" } })
    mocks.delete.mockResolvedValue({})
  })

  it("should initialize default state", () => {
    const { result } = renderHook(() => useAvatarUpload("123"))

    expect(result.current.files).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it("should clear files", () => {
    const { result } = renderHook(() => useAvatarUpload("123"))

    act(() => {
      result.current.clearFiles()
    })
    expect(result.current.files).toEqual([])
  })

  it("should handle avatar reject", () => {
    const { result } = renderHook(() => useAvatarUpload("123"))
    const mockFile = new File([""], "test.png", { type: "image/png" })

    result.current.onAvatarReject(mockFile, "File too large")

    expect(toast).toHaveBeenCalledWith("File too large", expect.any(Object))
  })

  it("should return early if no file is provided on accept", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const { result } = renderHook(() => useAvatarUpload("123"))

    await act(async () => {
      await result.current.onAvatarAccept([])
    })

    expect(consoleSpy).toHaveBeenCalledWith("No file uploaded")
    expect(mocks.upload).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("should upload avatar successfully", async () => {
    const { result } = renderHook(() => useAvatarUpload("123"))
    const mockFile = new File(["test content"], "test.png", {
      type: "image/png",
    })

    Object.defineProperty(mockFile, "size", { value: 1024 })

    await act(async () => {
      await result.current.onAvatarAccept([mockFile])
    })

    expect(fileToBase64).toHaveBeenCalledWith(mockFile)
    expect(mocks.upload).toHaveBeenCalledWith({
      variables: {
        avatar: {
          base64: "base64-data",
          size: 1024,
          type: "image/png",
          userId: "123",
        },
      },
    })
    expect(toast.success).toHaveBeenCalledWith("upload-avatar.status.success")
  })

  it("should handle upload error", async () => {
    const error = new Error("Upload failed")
    mocks.upload.mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useAvatarUpload("123"))
    const mockFile = new File(["test content"], "test.png", {
      type: "image/png",
    })

    await act(async () => {
      await result.current.onAvatarAccept([mockFile])
    })

    expect(consoleSpy).toHaveBeenCalledWith(error)
    expect(toast.error).toHaveBeenCalledWith("upload-avatar.status.error")
    consoleSpy.mockRestore()
  })

  it("should delete avatar successfully", async () => {
    const { result } = renderHook(() => useAvatarUpload("123"))

    await act(async () => {
      await result.current.onAvatarDelete()
    })

    expect(mocks.delete).toHaveBeenCalledWith({
      variables: { avatar: { userId: "123" } },
    })
    expect(toast.success).toHaveBeenCalledWith("delete-avatar.success")
  })

  it("should handle delete error", async () => {
    const error = new Error("Delete failed")
    mocks.delete.mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useAvatarUpload("123"))

    await act(async () => {
      await result.current.onAvatarDelete()
    })

    expect(consoleSpy).toHaveBeenCalledWith(error)
    expect(toast.error).toHaveBeenCalledWith("delete-avatar.error")
    consoleSpy.mockRestore()
  })

  it("should update cache on upload", () => {
    renderHook(() => useAvatarUpload("123"))
    // The first update function captured is for upload
    const uploadUpdate = mocks.updates[0]

    const mockCache = {
      identify: vi.fn((obj) => {
        if (obj.__ref) return obj.__ref
        return `${obj.__typename}:${obj.id}`
      }),
      modify: vi.fn(),
    }

    // Call it with valid data
    uploadUpdate(mockCache as unknown as MockCache, {
      data: { uploadAvatar: "new-avatar-url" },
    })

    expect(mockCache.modify).toHaveBeenCalled()

    // Test the internal profile modifier
    const modifyArgs = mockCache.modify.mock.calls[0][0]
    expect(modifyArgs.id).toBe("User:123")

    // simulate nested cache modifier
    const nestedProfileRef = { __ref: "Profile:456" }
    modifyArgs.fields.profile(nestedProfileRef)

    expect(mockCache.modify).toHaveBeenCalledTimes(2)
    const nestedModifyArgs = mockCache.modify.mock.calls[1][0]
    expect(nestedModifyArgs.id).toBe("Profile:456")
    expect(nestedModifyArgs.fields.avatar()).toBe("new-avatar-url")

    // Cover the missing branch: existingProfileRef is falsy
    expect(modifyArgs.fields.profile(null)).toBe(null)

    // Call it without data to cover early return
    mockCache.modify.mockClear()
    uploadUpdate(mockCache as unknown as MockCache, { data: null })
    expect(mockCache.modify).not.toHaveBeenCalled()
  })

  it("should update cache on delete", () => {
    renderHook(() => useAvatarUpload("123"))
    // The second update function captured is for delete
    const deleteUpdate = mocks.updates[1]

    const mockCache = {
      identify: vi.fn((obj) => {
        if (obj.__ref) return obj.__ref
        return `${obj.__typename}:${obj.id}`
      }),
      modify: vi.fn(),
    }

    deleteUpdate(mockCache as unknown as MockCache)

    expect(mockCache.modify).toHaveBeenCalled()

    const modifyArgs = mockCache.modify.mock.calls[0][0]
    expect(modifyArgs.id).toBe("User:123")

    const nestedProfileRef = { __ref: "Profile:456" }
    modifyArgs.fields.profile(nestedProfileRef)

    expect(mockCache.modify).toHaveBeenCalledTimes(2)
    const nestedModifyArgs = mockCache.modify.mock.calls[1][0]
    expect(nestedModifyArgs.id).toBe("Profile:456")
    expect(nestedModifyArgs.fields.avatar()).toBe(null)

    // Cover the missing branch: existingProfileRef is falsy
    expect(modifyArgs.fields.profile(null)).toBe(null)
  })
})
