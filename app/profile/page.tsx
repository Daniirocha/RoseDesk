"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, UserIcon, AlertCircle, Check } from "lucide-react"
import { getUser } from "@/lib/auth"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)
    setName(userData.name)
    setEmail(userData.email)
  }, [router])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar perfil")
      }

      localStorage.setItem("user", JSON.stringify(data))
      setUser(data)
      setSuccess("Perfil atualizado com sucesso!")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao alterar senha")
      }

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setSuccess("Senha alterada com sucesso!")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais</p>
          </div>

          {/* User Info Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {user && getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Badge className="mt-2" variant={user?.role === "ADMIN" ? "default" : "secondary"}>
                    {user?.role === "ADMIN" ? (
                      <>
                        <Shield className="mr-1 h-3 w-3" />
                        Administrador
                      </>
                    ) : (
                      <>
                        <UserIcon className="mr-1 h-3 w-3" />
                        Usuário
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-700">
              <Check className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Update Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize seus dados cadastrais</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Atualize sua senha de acesso</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? "Alterando..." : "Alterar Senha"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
