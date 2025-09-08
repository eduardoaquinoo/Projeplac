import { useState } from 'react';
import { Button } from './ui/button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-gradient-to-r from-green-600 to-orange-500 text-white hover:from-green-700 hover:to-orange-600">
              <i className="fas fa-plus mr-2"></i>
              Novo Projeto
            </Button>
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
              <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-orange-500 text-white">
                <i className="fas fa-plus mr-2"></i>
                Novo Projeto
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}