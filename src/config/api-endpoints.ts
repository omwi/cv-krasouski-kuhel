export const API_ENDPOINTS = {
  graphql: "/api/graphql",
  auth: {
    refresh: "/api/auth/refresh",
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
    "forgot-password": "/api/auth/forgot-password",
  },
} as const
