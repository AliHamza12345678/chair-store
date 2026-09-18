export interface UserProfile {
  id: string
  name: string | null
  email: string | null
  role: "USER" | "ADMIN"
  createdAt: Date
}
