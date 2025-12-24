"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Flower, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await api.login(email, password)

      // Armazena dados do usuário
      localStorage.setItem("user", JSON.stringify(data.user))

      // Redireciona para dashboard
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (role: "admin" | "user") => {
    if (role === "admin") {
      setEmail("admin@rosedesk.com")
      setPassword("admin123")
    } else {
      setEmail("user@rosedesk.com")
      setPassword("user123")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Flower className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Bem-vindo ao RoseDesk</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Usuários de demonstração</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Button type="button" variant="outline" onClick={() => fillDemoCredentials("admin")}>
                Usar Admin Demo
              </Button>
              <Button type="button" variant="outline" onClick={() => fillDemoCredentials("user")}>
                Usar Usuário Demo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
