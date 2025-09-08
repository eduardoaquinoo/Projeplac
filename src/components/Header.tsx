import { useState } from 'react';
import { Button } from './ui/button';
import { useAuth } from './AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

interface HeaderProps {
  onNewProject?: () => void;
}

export function Header({ onNewProject }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                <i className="fas fa-code text-green-600 mr-2"></i>
                Projeplac
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#inicio" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-colors">
                Início
              </a>
              <a href="#projetos" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-colors">
                Projetos
              </a>
              <a href="#dashboard" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-colors">
                Dashboard
              </a>
              <a href="#sobre" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md transition-colors">
                Sobre
              </a>
            </div>
          </nav>

          {/* User Menu / CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button 
                  onClick={onNewProject}
                  className="bg-gradient-to-r from-green-600 to-orange-500 text-white hover:from-green-700 hover:to-orange-600"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Novo Projeto
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-green-400 to-orange-400 text-white">
                          {user?.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.username}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onNewProject}>
                      <i className="fas fa-plus mr-2"></i>
                      Novo Projeto
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <i className="fas fa-user mr-2"></i>
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <i className="fas fa-cog mr-2"></i>
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button className="bg-gradient-to-r from-green-600 to-orange-500 text-white hover:from-green-700 hover:to-orange-600">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Entrar
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <a href="#inicio" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md">
                Início
              </a>
              <a href="#projetos" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md">
                Projetos
              </a>
              <a href="#dashboard" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md">
                Dashboard
              </a>
              <a href="#sobre" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md">
                Sobre
              </a>
              {isAuthenticated ? (
                <>
                  <Button 
                    onClick={onNewProject}
                    className="w-full mt-4 bg-gradient-to-r from-green-600 to-orange-500 text-white"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Novo Projeto
                  </Button>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-green-400 to-orange-400 text-white text-sm">
                          {user?.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user?.username}</p>
                        <p className="text-xs text-gray-500">
                          {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={logout}
                      variant="ghost" 
                      className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Sair
                    </Button>
                  </div>
                </>
              ) : (
                <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-orange-500 text-white">
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Entrar
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}