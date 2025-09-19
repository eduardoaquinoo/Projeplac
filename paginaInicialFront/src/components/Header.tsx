import { Button } from "./ui/button";
import { Search, Menu, User } from "lucide-react";
import projeplacLogo from "figma:asset/39cb47107210f0a99082ac49f562cb6b1d25b7af.png";

export function Header() {
  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Nome */}
          <div className="flex items-center">
            <img 
              src={projeplacLogo} 
              alt="Projeplac Logo" 
              className="h-8 w-auto"
            />
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Início
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Projetos
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Categorias
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Sobre
            </a>
          </nav>

          {/* Botões de Ação */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <User className="h-4 w-4 mr-2" />
              Entrar
            </Button>
            <Button size="sm" className="bg-secondary hover:bg-secondary/90">
              Publicar Projeto
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}