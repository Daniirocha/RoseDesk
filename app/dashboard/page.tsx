"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ticket, Clock, CheckCircle2, AlertCircle, TrendingUp, Plus, BarChart3, Users } from "lucide-react"
import { getUser } from "@/lib/auth"
import { api } from "@/lib/api"

interface DashboardStats {
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  closedTickets: number
  myTickets: number
  avgResponseTime: string
}

interface RecentTicket {
  id: number
  title: string
  status: string
  priority: string
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)
    loadDashboardData(userData)
  }, [router])

  const loadDashboardData = async (userData: any) => {
    try {
      const statsData = await api.getStats(userData.id, userData.role)
      setStats(statsData)

      const ticketsData = await api.getTickets(userData.id, userData.role)
      setRecentTickets(ticketsData.tickets.slice(0, 5) || [])
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "destructive"
      case "HIGH":
        return "secondary"
      case "MEDIUM":
        return "outline"
      case "LOW":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-700"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700"
      case "CLOSED":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Aberto"
      case "IN_PROGRESS":
        return "Em Progresso"
      case "CLOSED":
        return "Fechado"
      default:
        return status
    }
  }

  const translatePriority = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "Urgente"
      case "HIGH":
        return "Alta"
      case "MEDIUM":
        return "Média"
      case "LOW":
        return "Baixa"
      default:
        return priority
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Bem-vindo de volta, {user?.name}</p>
          </div>
          <Button onClick={() => router.push("/tickets/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Ticket
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTickets || 0}</div>
              <p className="text-xs text-muted-foreground">Todos os tickets no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abertos</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.openTickets || 0}</div>
              <p className="text-xs text-muted-foreground">Aguardando atendimento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.inProgressTickets || 0}</div>
              <p className="text-xs text-muted-foreground">Sendo atendidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fechados</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.closedTickets || 0}</div>
              <p className="text-xs text-muted-foreground">Resolvidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tickets Recentes</CardTitle>
                <CardDescription>Seus tickets mais recentes</CardDescription>
              </div>
              <Button variant="outline" onClick={() => router.push("/tickets")}>
                Ver Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Nenhum ticket encontrado</p>
                <Button className="mt-4" onClick={() => router.push("/tickets/new")}>
                  Criar Primeiro Ticket
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{ticket.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Criado em {new Date(ticket.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(ticket.priority)}>{translatePriority(ticket.priority)}</Badge>
                      <Badge className={getStatusColor(ticket.status)}>{translateStatus(ticket.status)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions for Admin */}
        {user?.role === "ADMIN" && (
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => router.push("/admin/users")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gerenciar Usuários
                </CardTitle>
                <CardDescription>Visualizar e gerenciar todos os usuários</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => router.push("/admin/reports")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Relatórios
                </CardTitle>
                <CardDescription>Visualizar estatísticas e relatórios</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => router.push("/tickets")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Todos os Tickets
                </CardTitle>
                <CardDescription>Gerenciar todos os tickets do sistema</CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
