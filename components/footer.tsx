import { Flower } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Flower className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">RoseDesk</span>
            </div>
            <p className="text-sm text-muted-foreground text-pretty">
              Transformando a experiência de atendimento ao cliente com tecnologia moderna.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Produto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Preços
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Integrações
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Atualizações
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termos
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Segurança
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  LGPD
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} RoseDesk. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
