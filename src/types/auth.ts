import { z } from "zod"

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const SignupSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type SignupInput = z.infer<typeof SignupSchema>

export interface User {
  id: string
  email: string
  role: string
}

export interface LoginResponse {
  login: {
    access_token: string
    refresh_token: string
    user: User
  }
}

export interface SignupResponse {
  signup: {
    access_token: string
    refresh_token: string
    user: User
  }
}
