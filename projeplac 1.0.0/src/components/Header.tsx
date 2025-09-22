import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Search, Menu, User, LogOut, Home, FolderOpen, UserCircle, Settings } from "lucide-react";
import { useState } from "react";
import projeplacLogo from "figma:asset/39cb47107210f0a99082ac49f562cb6b1d25b7af.png";

interface HeaderProps {
  onNavigateToCreateProject: () => void;
  onNavigateToProjects: () => void;
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
  onNavigateToProfile: () => void;
  onNavigateToMyProjects: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function Header({ 
  onNavigateToCreateProject, 
  onNavigateToProjects, 
  onNavigateToLogin, 
  onNavigateToHome,
  onNavigateToProfile,
  onNavigateToMyProjects,
  isLoggedIn, 
  onLogout 
}: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navegar para projetos com termo de pesquisa
      onNavigateToProjects();
      // TODO: Implementar busca global
      console.log('Pesquisando por:', searchTerm);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Nome */}
          <div className="flex items-center">
            <button 
              onClick={onNavigateToHome}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img 
                src={projeplacLogo} 
                alt="Projeplac Logo" 
                className="h-8 w-auto"
              />
            </button>
          </div>

          {/* Barra de Pesquisa Central */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Pesquisar projetos, autores, tecnologias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 w-full bg-muted/50 border-border/50 focus:bg-background transition-colors"
                />
              </div>
            </form>
          </div>

          {/* Navegação e Ações */}
          <div className="flex items-center space-x-4">
            {/* Navegação Desktop */}
            <nav className="hidden lg:flex space-x-6">
              <button 
                onClick={onNavigateToHome}
                className="text-foreground hover:text-primary transition-colors flex items-center"
              >
                <Home className="h-4 w-4 mr-1" />
                Início
              </button>
              <button 
                onClick={onNavigateToProjects}
                className="text-foreground hover:text-primary transition-colors flex items-center"
              >
                <FolderOpen className="h-4 w-4 mr-1" />
                Projetos
              </button>
            </nav>

            {/* Menu do Usuário */}
            <div className="flex items-center space-x-2">
              {isLoggedIn ? (
                <>
                  {/* Botão Publicar Projeto */}
                  <Button 
                    size="sm" 
                    className="bg-secondary hover:bg-secondary/90 hidden sm:flex"
                    onClick={onNavigateToCreateProject}
                  >
                    Publicar Projeto
                  </Button>

                  {/* Menu do Usuário Logado */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <UserCircle className="h-5 w-5" />
                        <span className="ml-2 hidden sm:inline">Perfil</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={onNavigateToProfile}>
                        <UserCircle className="h-4 w-4 mr-2" />
                        Meu Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onNavigateToMyProjects}>
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Meus Projetos
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Configurações
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onLogout} className="text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* Botões para usuário não logado */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onNavigateToLogin}
                    className="hidden sm:flex"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-secondary hover:bg-secondary/90"
                    onClick={onNavigateToCreateProject}
                  >
                    Publicar Projeto
                  </Button>
                </>
              )}

              {/* Menu Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onNavigateToHome}>
                    <Home className="h-4 w-4 mr-2" />
                    Início
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onNavigateToProjects}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Projetos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isLoggedIn ? (
                    <>
                      <DropdownMenuItem onClick={onNavigateToProfile}>
                        <UserCircle className="h-4 w-4 mr-2" />
                        Meu Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onNavigateToMyProjects}>
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Meus Projetos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onLogout} className="text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={onNavigateToLogin}>
                      <User className="h-4 w-4 mr-2" />
                      Entrar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa Mobile */}
        <div className="md:hidden pb-3 pt-2">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 w-full bg-muted/50 border-border/50 focus:bg-background transition-colors"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}