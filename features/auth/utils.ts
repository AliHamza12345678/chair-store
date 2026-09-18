export function getAuthRedirectUrl(role?: string) {
  if (role === "ADMIN") {
    return "/admin/dashboard"
  }
  return "/account/orders"
}
