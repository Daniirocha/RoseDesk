"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter } from "lucide-react"
import { getUser } from "@/lib/auth"
import { api } from "@/lib/api"

interface Ticket {
  id: number
  title: string
  description: string
  status: string
  priority: string
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export default function TicketsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)
    loadTickets(userData)
  }, [router])

  const loadTickets = async (userData: any) => {
    try {
      const data = await api.getTickets(userData.id, userData.role)
      setTickets(data.tickets || [])
    } catch (error) {
      console.error("Erro ao carregar tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "ALL" || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tickets</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus tickets de suporte</p>
          </div>
          <Button onClick={() => router.push("/tickets/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Ticket
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tickets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os Status</SelectItem>
                  <SelectItem value="OPEN">Aberto</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="CLOSED">Fechado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas as Prioridades</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="LOW">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">Carregando tickets...</p>
            </CardContent>
          </Card>
        ) : filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhum ticket encontrado</p>
              <Button onClick={() => router.push("/tickets/new")}>Criar Primeiro Ticket</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => router.push(`/tickets/${ticket.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{ticket.title}</h3>
                        <Badge variant={getPriorityColor(ticket.priority)}>{translatePriority(ticket.priority)}</Badge>
                        <Badge className={getStatusColor(ticket.status)}>{translateStatus(ticket.status)}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Criado por: {ticket.user.name}</span>
                        <span>•</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
