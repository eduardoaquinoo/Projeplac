import { Button } from './ui/button';
import { Input } from './ui/input';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-orange-400 bg-clip-text text-transparent">
              <i className="fas fa-code text-green-400 mr-2"></i>
              Projeplac
            </h3>
            <p className="text-gray-400 leading-relaxed">
              O repositório digital definitivo para projetos de tecnologia da informação. 
              Conectando desenvolvedores e impulsionando a inovação.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-green-400 p-2">
                <i className="fab fa-github text-lg"></i>
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-green-400 p-2">
                <i className="fab fa-linkedin text-lg"></i>
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-green-400 p-2">
                <i className="fab fa-twitter text-lg"></i>
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-green-400 p-2">
                <i className="fab fa-discord text-lg"></i>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-6 text-green-400">Navegação</h4>
            <ul className="space-y-3">
              <li>
                <a href="#inicio" className="text-gray-400 hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#projetos" className="text-gray-400 hover:text-white transition-colors">
                  Projetos
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-6 text-orange-400">Comunidade</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contribuir
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Fórum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Suporte
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-6 text-green-400">Newsletter</h4>
            <p className="text-gray-400 mb-4 text-sm">
              Receba as últimas novidades sobre projetos e tecnologias.
            </p>
            <div className="space-y-3">
              <Input 
                placeholder="Seu email" 
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500"
              />
              <Button className="w-full bg-gradient-to-r from-green-600 to-orange-500 text-white hover:from-green-700 hover:to-orange-600">
                <i className="fas fa-paper-plane mr-2"></i>
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 Projeplac. Todos os direitos reservados.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="sm"
          className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all hover:from-green-700 hover:to-orange-600"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <i className="fas fa-arrow-up"></i>
        </Button>
      </div>
    </footer>
  );
}