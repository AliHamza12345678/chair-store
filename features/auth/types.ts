export interface AuthUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: "USER" | "ADMIN"
}

export interface AuthSession {
  user: AuthUser
}
