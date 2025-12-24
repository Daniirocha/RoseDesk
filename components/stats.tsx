import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { value: "50mil+", label: "Chamados Resolvidos" },
  { value: "1.2k+", label: "Empresas Atendidas" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Avaliação Média" },
]

export function Stats() {
  return (
    <section className="py-20 lg:py-32 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance mb-4">
            Números que falam por si
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">Confiança construída através de resultados reais.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
