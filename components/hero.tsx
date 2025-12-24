import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Transforme seu atendimento</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            Gestão de Chamados que <span className="text-primary">Encanta</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl lg:text-2xl text-pretty max-w-2xl mx-auto">
            Centralize, organize e resolva todos os chamados da sua empresa em uma plataforma moderna e intuitiva.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="group">
              Experimentar Gratuitamente
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              Assistir Demo
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Satisfação</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">-60%</div>
              <div className="text-sm text-muted-foreground">Tempo de Resposta</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Suporte</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
    </section>
  )
}
