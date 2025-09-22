import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <h3 className="text-xl font-bold text-primary-foreground mb-4">PROJEPLAC</h3>
            <p className="text-primary-foreground/80 mb-4">
              Conectando estudantes da UNICEPLAC e promovendo a divulgação de projetos acadêmicos.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-primary-foreground/10 text-primary-foreground">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-primary-foreground/10 text-primary-foreground">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-primary-foreground/10 text-primary-foreground">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Explorar Projetos
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Categorias
                </a>
              </li>
              <li>
                <a 
                  href="https://www.uniceplac.edu.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  UNICEPLAC
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Publicar Projeto
                </a>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Como Publicar
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Diretrizes
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        {/* Informações de Contato */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-primary-foreground/80" />
            <span className="text-primary-foreground/80 text-sm">eduardo.aquino@esoftware.uniceplac.edu.br</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-primary-foreground/80" />
            <span className="text-primary-foreground/80 text-sm">(61) 98282-9992</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-primary-foreground/80" />
            <span className="text-primary-foreground/80 text-sm">Gama, DF - Brasil</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-primary-foreground/60 text-sm">
          <p>&copy; 2025 Projeplac. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}