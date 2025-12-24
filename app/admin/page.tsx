"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser, isAdmin } from "@/lib/auth"
import { Users, Ticket, BarChart3, Settings } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

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
    setUser(userData)
  }, [router])

  const adminCards = [
    {
      title: "Gerenciar Usuários",
      description: "Visualize, crie e gerencie usuários do sistema",
      icon: Users,
      href: "/admin/users",
      color: "text-blue-500",
    },
    {
      title: "Todos os Tickets",
      description: "Visualize e gerencie todos os tickets do sistema",
      icon: Ticket,
      href: "/tickets",
      color: "text-pink-500",
    },
    {
      title: "Relatórios",
      description: "Visualize estatísticas e relatórios detalhados",
      icon: BarChart3,
      href: "/admin/reports",
      color: "text-purple-500",
    },
    {
      title: "Configurações",
      description: "Configure parâmetros do sistema",
      icon: Settings,
      href: "/admin/settings",
      color: "text-gray-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1">Gerencie todo o sistema RoseDesk</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {adminCards.map((card) => {
            const Icon = card.icon
            return (
              <Card
                key={card.href}
                className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
                onClick={() => router.push(card.href)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <div>
                      <CardTitle>{card.title}</CardTitle>
                      <CardDescription className="mt-1">{card.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
