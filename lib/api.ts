const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export interface User {
  id: number
  name: string
  email: string
  role: "USER" | "ADMIN"
}

export interface Ticket {
  id: number
  title: string
  description: string
  status: string
  priority: string
  userId: number
  user?: User
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: number
  content: string
  userId: number
  ticketId: number
  user?: User
  createdAt: string
}

export interface LoginResponse {
  user: User
}

export interface TicketsResponse {
  tickets: Ticket[]
  total: number
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.erro || "Erro ao fazer requisição")
    }

    return data as T
  }

  // Auth
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  // Tickets
  async getTickets(userId?: number, userRole?: string): Promise<TicketsResponse> {
    const params = new URLSearchParams()
    if (userId) params.append("userId", userId.toString())
    if (userRole) params.append("userRole", userRole)

    return this.request<TicketsResponse>(`/tickets?${params.toString()}`)
  }

  async getTicket(id: number, userId: number): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${id}?userId=${userId}`)
  }

  async createTicket(data: {
    title: string
    description: string
    priority: string
    userId: number
  }): Promise<Ticket> {
    return this.request<Ticket>("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateTicket(
    id: number,
    data: {
      status?: string
      priority?: string
      userId: number
      userRole: string
    },
  ): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Comments
  async addComment(ticketId: number, content: string, userId: number): Promise<Comment> {
    return this.request<Comment>(`/tickets/${ticketId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content, userId }),
    })
  }

  // Stats
  async getStats(userId: number, userRole: string) {
    return this.request(`/tickets/stats?userId=${userId}&userRole=${userRole}`)
  }

  // Users (Admin only)
  async getUsers() {
    return this.request("/users")
  }

  async updateUser(id: number, data: { role?: string }) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: number) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    })
  }
}

export const api = new ApiService()
