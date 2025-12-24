"use client"

import { Button } from "@/components/ui/button"
import { Menu, Flower } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Flower className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">RoseDesk</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#recursos"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Recursos
            </a>
            <a
              href="#solucoes"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Soluções
            </a>
            <a
              href="#precos"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Preços
            </a>
            <a
              href="#contato"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex" onClick={() => (window.location.href = "/login")}>
              Entrar
            </Button>
            <Button onClick={() => (window.location.href = "/login")}>Começar Grátis</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
