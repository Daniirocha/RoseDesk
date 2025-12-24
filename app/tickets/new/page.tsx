"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { getUser } from "@/lib/auth"
import { api } from "@/lib/api"

export default function NewTicketPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("MEDIUM")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const user = getUser()
    if (!user) {
      router.push("/login")
      return
    }

    try {
      const data = await api.createTicket({
        title,
        description,
        priority,
        userId: user.id,
      })

      router.push(`/tickets/${data.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Novo Ticket</CardTitle>
            <CardDescription>Crie um novo ticket de suporte</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Descreva brevemente o problema"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o problema em detalhes"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={priority} onValueChange={setPriority}>
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

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Criando..." : "Criar Ticket"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
