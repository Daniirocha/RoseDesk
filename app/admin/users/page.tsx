"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, Search, AlertCircle, Shield, UserIcon } from "lucide-react"
import { getUser, isAdmin } from "@/lib/auth"
import { api } from "@/lib/api"

interface User {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // New user form
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [newUserRole, setNewUserRole] = useState("USER")

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
    loadUsers()
  }, [router])

  const loadUsers = async () => {
    try {
      const data = await api.getUsers()
      setUsers(data || [])
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar usuário")
      }

      setIsDialogOpen(false)
      setNewUserName("")
      setNewUserEmail("")
      setNewUserPassword("")
      setNewUserRole("USER")
      loadUsers()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.push("/admin")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Admin
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gerenciar Usuários</h1>
            <p className="text-muted-foreground mt-1">Visualize e gerencie todos os usuários do sistema</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>Adicione um novo usuário ao sistema</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Senha segura"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Select value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Usuário</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? "Criando..." : "Criar Usuário"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">Carregando usuários...</p>
            </CardContent>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${user.role === "ADMIN" ? "bg-primary" : "bg-muted"}`}
                      >
                        {user.role === "ADMIN" ? (
                          <Shield className="h-6 w-6 text-primary-foreground" />
                        ) : (
                          <UserIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <CardDescription className="text-xs">{user.email}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Desde {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </p>
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
