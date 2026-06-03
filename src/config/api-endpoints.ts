export const API_ENDPOINTS = {
  graphql: "/api/graphql",
  auth: {
    refresh: "/api/auth/refresh",
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    logout: "/api/auth/logout",
    "forgot-password": "/api/auth/forgot-password",
    "reset-password": "/api/auth/reset-password",
    verify: "/api/auth/verify",
  },
} as const
