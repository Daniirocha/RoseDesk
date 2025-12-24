import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section id="contato" className="py-20 lg:py-32 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance mb-6">
            Pronto para transformar seu atendimento?
          </h2>
          <p className="text-lg text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empresas que já melhoraram sua experiência de suporte com RoseDesk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="group">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              Falar com Vendas
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Teste grátis por 14 dias. Não é necessário cartão de crédito.
          </p>
        </div>
      </div>
    </section>
  )
}
