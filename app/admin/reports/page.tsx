"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Users, Ticket, Clock } from "lucide-react"
import { getUser, isAdmin } from "@/lib/auth"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ReportStats {
  totalUsers: number
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  closedTickets: number
  avgResponseTime: string
  ticketsByPriority: { priority: string; count: number }[]
  ticketsByStatus: { status: string; count: number }[]
}

export default function AdminReportsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }
    if (!isAdmin()) {
      router.push("/dashboard")
      return
    }
    setCurrentUser(userData)
    loadReports()
  }, [router])

  const loadReports = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/tickets/reports")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error)
    } finally {
      setLoading(false)
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

  const chartConfig = {
    count: {
      label: "Quantidade",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.push("/admin")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Admin
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Relatórios e Estatísticas</h1>
          <p className="text-muted-foreground mt-1">Visualize métricas e insights do sistema</p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">Carregando relatórios...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">Usuários registrados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalTickets || 0}</div>
                  <p className="text-xs text-muted-foreground">Todos os tickets criados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tickets Abertos</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.openTickets || 0}</div>
                  <p className="text-xs text-muted-foreground">Aguardando atendimento</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.avgResponseTime || "N/A"}</div>
                  <p className="text-xs text-muted-foreground">Tempo de resposta</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets por Prioridade</CardTitle>
                  <CardDescription>Distribuição de tickets por nível de prioridade</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats?.ticketsByPriority.map((item) => ({
                          name: translatePriority(item.priority),
                          count: item.count,
                        }))}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tickets por Status</CardTitle>
                  <CardDescription>Distribuição de tickets por status atual</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats?.ticketsByStatus.map((item) => ({
                          name: translateStatus(item.status),
                          count: item.count,
                        }))}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Em Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-500">{stats?.inProgressTickets || 0}</div>
                  <p className="text-sm text-muted-foreground mt-2">Tickets sendo atendidos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fechados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">{stats?.closedTickets || 0}</div>
                  <p className="text-sm text-muted-foreground mt-2">Tickets resolvidos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Resolução</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {stats?.totalTickets ? Math.round(((stats.closedTickets || 0) / stats.totalTickets) * 100) : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Tickets concluídos</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
