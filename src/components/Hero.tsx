import { Button } from './ui/button';

export function Hero() {
  return (
    <section id="inicio" className="pt-20 pb-16 bg-gradient-to-br from-green-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div data-aos="fade-right">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Repositório Digital de{' '}
              <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                Projetos TI
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Descubra, compartilhe e colabore em projetos inovadores de tecnologia da informação. 
              Uma plataforma moderna para a comunidade de desenvolvedores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
              >
                <i className="fas fa-rocket mr-2"></i>
                Explorar Projetos
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <i className="fas fa-play mr-2"></i>
                Assistir Demo
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div data-aos="fade-left" className="relative">
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-20 animate-pulse"></div>
              
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-3 bg-gradient-to-r from-green-200 to-green-300 rounded-full"></div>
                  <div className="h-3 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full"></div>
                  <div className="h-3 bg-gradient-to-r from-green-200 to-orange-200 rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-code text-white text-sm"></i>
                    </div>
                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-mobile-alt text-white text-sm"></i>
                    </div>
                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <i className="fas fa-database text-white text-sm"></i>
                    </div>
                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div data-aos="fade-up" className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600">Projetos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">1,200+</div>
            <div className="text-gray-600">Desenvolvedores</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Tecnologias</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
            <div className="text-gray-600">Satisfação</div>
          </div>
        </div>
      </div>
    </section>
  );
}