"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, AlertCircle, MessageSquare, Clock } from "lucide-react"
import { getUser, isAdmin } from "@/lib/auth"
import { api } from "@/lib/api"

interface Comment {
  id: number
  content: string
  createdAt: string
  user: {
    name: string
    email: string
  }
}

interface Ticket {
  id: number
  title: string
  description: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
  user: {
    name: string
    email: string
  }
  comments: Comment[]
}

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ticketId = params.id as string

  const [user, setUser] = useState<any>(null)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [newPriority, setNewPriority] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)
    loadTicket(userData)
  }, [router, ticketId])

  const loadTicket = async (userData: any) => {
    try {
      const data = await api.getTicket(Number(ticketId), userData.id)

      setTicket(data)
      setNewStatus(data.status)
      setNewPriority(data.priority)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return

    setSubmitting(true)
    setError("")

    try {
      await api.addComment(Number(ticketId), comment, user.id)

      setComment("")
      loadTicket(user)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateTicket = async () => {
    setSubmitting(true)
    setError("")

    try {
      await api.updateTicket(Number(ticketId), {
        status: newStatus,
        priority: newPriority,
        userId: user.id,
        userRole: user.role,
      })

      loadTicket(user)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <p className="text-center text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error && !ticket) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/tickets")} className="mt-4">
            Voltar para Tickets
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{ticket?.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(ticket?.priority || "")}>
                        {translatePriority(ticket?.priority || "")}
                      </Badge>
                      <Badge className={getStatusColor(ticket?.status || "")}>
                        {translateStatus(ticket?.status || "")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Descrição</h4>
                  <p className="text-foreground">{ticket?.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Criado por</p>
                    <p className="font-medium">{ticket?.user.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data de criação</p>
                    <p className="font-medium">
                      {ticket?.createdAt && new Date(ticket.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comentários ({ticket?.comments.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ticket?.comments && ticket.comments.length > 0 ? (
                  <div className="space-y-4">
                    {ticket.comments.map((c) => (
                      <div key={c.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{c.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(c.createdAt).toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{c.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-50" />
                    <p>Nenhum comentário ainda</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Textarea
                    placeholder="Adicione um comentário..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddComment} disabled={submitting || !comment.trim()}>
                    {submitting ? "Enviando..." : "Adicionar Comentário"}
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isAdmin() && (
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Ticket</CardTitle>
                  <CardDescription>Atualize o status e prioridade</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Aberto</SelectItem>
                        <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                        <SelectItem value="CLOSED">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prioridade</label>
                    <Select value={newPriority} onValueChange={setNewPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Baixa</SelectItem>
                        <SelectItem value="MEDIUM">Média</SelectItem>
                        <SelectItem value="HIGH">Alta</SelectItem>
                        <SelectItem value="URGENT">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleUpdateTicket}
                    disabled={submitting || (newStatus === ticket?.status && newPriority === ticket?.priority)}
                    className="w-full"
                  >
                    {submitting ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Histórico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Criado</p>
                    <p className="font-medium">
                      {ticket?.createdAt && new Date(ticket.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Última atualização</p>
                    <p className="font-medium">
                      {ticket?.updatedAt && new Date(ticket.updatedAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
