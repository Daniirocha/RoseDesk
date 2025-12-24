"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser } from "@/lib/auth"
import { Bell, Lock, Palette, Globe } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }
  }, [router])

  const settingsCards = [
    {
      title: "Notificações",
      description: "Configure suas preferências de notificação",
      icon: Bell,
      color: "text-blue-500",
      comingSoon: true,
    },
    {
      title: "Privacidade",
      description: "Gerencie suas configurações de privacidade",
      icon: Lock,
      color: "text-green-500",
      comingSoon: true,
    },
    {
      title: "Aparência",
      description: "Personalize o tema e visual do sistema",
      icon: Palette,
      color: "text-purple-500",
      comingSoon: true,
    },
    {
      title: "Idioma",
      description: "Escolha o idioma da interface",
      icon: Globe,
      color: "text-orange-500",
      comingSoon: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground mt-1">Personalize sua experiência no RoseDesk</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {settingsCards.map((card) => {
              const Icon = card.icon
              return (
                <Card key={card.title} className="relative">
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
                  {card.comingSoon && (
                    <div className="absolute top-4 right-4">
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Em breve</span>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
