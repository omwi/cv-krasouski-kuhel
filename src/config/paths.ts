export const paths = {
  auth: {
    login: {
      get(redirectTo?: string) {
        return `/auth/login${redirectTo ? `?redirectTo=${redirectTo}` : ""}`
      },
    },
    signup: {
      get(redirectTo?: string) {
        return `/auth/signup${redirectTo ? `?redirectTo=${redirectTo}` : ""}`
      },
    },
    forgotPassword: {
      get() {
        const redirectTo = paths.auth.login.get()
        return `/auth/forgot-password?redirectTo=${redirectTo}`
      },
    },
    resetPassword: {
      get(token: string) {
        return `/auth/reset-password?token=${token}`
      },
    },
  },

  users: {
    get() {
      return "/users"
    },
    details: {
      get(userId: number | string) {
        return `/users/${userId}`
      },
    },
    skills: {
      get(userId: number | string) {
        return `/users/${userId}/skills`
      },
    },
    languages: {
      get(userId: number | string) {
        return `/users/${userId}/languages`
      },
    },
    cvs: {
      get(userId: number | string) {
        return `/users/${userId}/cvs`
      },
    },
  },

  projects: {
    get() {
      return "/projects"
    },
    details: {
      get(projectId: number | string) {
        return `/projects/${projectId}`
      },
    },
  },

  cvs: {
    get() {
      return "/cvs"
    },
    details: {
      get(cvId: number | string) {
        return `/cvs/${cvId}`
      },
    },
    skills: {
      get(cvId: number | string) {
        return `/cvs/${cvId}/skills`
      },
    },
    projects: {
      get(cvId: number | string) {
        return `/cvs/${cvId}/projects`
      },
    },
    preview: {
      get(cvId: number | string) {
        return `/cvs/${cvId}/preview`
      },
    },
  },

  departments: {
    get() {
      return "/departments"
    },
  },

  positions: {
    get() {
      return "/positions"
    },
  },

  skills: {
    get() {
      return "/skills"
    },
  },

  languages: {
    get() {
      return "/languages"
    },
  },

  settings: {
    get() {
      return "/settings"
    },
  },
  verification: {
    get() {
      return `/verify-email`
    },
  },
} as const
