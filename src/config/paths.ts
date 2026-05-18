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
      get(userId: string) {
        return `/users/${userId}`
      },
    },
    profile: {
      get(userId: string) {
        return `/users/${userId}/profile`
      },
    },
    skills: {
      get(userId: string) {
        return `/users/${userId}/skills`
      },
    },
    languages: {
      get(userId: string) {
        return `/users/${userId}/languages`
      },
    },
    cvs: {
      get(userId: string) {
        return `/users/${userId}/cvs`
      },
    },
  },

  projects: {
    get() {
      return "/projects"
    },
    details: {
      get(projectId: string) {
        return `/projects/${projectId}`
      },
    },
  },

  cvs: {
    get() {
      return "/cvs"
    },
    details: {
      get(cvId: string) {
        return `/cvs/${cvId}/details`
      },
    },
    skills: {
      get(cvId: string) {
        return `/cvs/${cvId}/skills`
      },
    },
    projects: {
      get(cvId: string) {
        return `/cvs/${cvId}/projects`
      },
    },
    preview: {
      get(cvId: string) {
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
} as const
