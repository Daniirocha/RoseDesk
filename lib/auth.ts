export interface User {
  id: number
  name: string
  email: string
  role: "USER" | "ADMIN"
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}

export function isAdmin(): boolean {
  const user = getUser()
  return user?.role === "ADMIN"
}

export function requireAuth(router: any) {
  if (!isAuthenticated()) {
    router.push("/login")
    return false
  }
  return true
}

export function requireAdmin(router: any) {
  if (!isAdmin()) {
    router.push("/dashboard")
    return false
  }
  return true
}
