import { Card, CardContent } from "@/components/ui/card"
import { Ticket, Users, BarChart3, Zap, Shield, Clock } from "lucide-react"

const features = [
  {
    icon: Ticket,
    title: "Gestão de Chamados",
    description: "Organize e priorize todos os tickets em um único lugar com fluxos automatizados.",
  },
  {
    icon: Users,
    title: "Colaboração em Equipe",
    description: "Trabalhe em conjunto com sua equipe e mantenha todos informados em tempo real.",
  },
  {
    icon: BarChart3,
    title: "Relatórios Inteligentes",
    description: "Acompanhe métricas e KPIs com dashboards visuais e insights acionáveis.",
  },
  {
    icon: Zap,
    title: "Automações Poderosas",
    description: "Automatize tarefas repetitivas e acelere o tempo de resolução de problemas.",
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Seus dados protegidos com criptografia de ponta e conformidade LGPD.",
  },
  {
    icon: Clock,
    title: "SLA Configurável",
    description: "Defina e monitore acordos de nível de serviço personalizados para cada cliente.",
  },
]

export function Features() {
  return (
    <section id="recursos" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance mb-4">
            Tudo que você precisa para um atendimento excepcional
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Recursos completos para transformar a experiência do seu suporte.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
