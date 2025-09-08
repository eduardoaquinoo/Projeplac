import { useState, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const mockProjects = [
  {
    id: 1,
    title: "Sistema de E-commerce",
    description: "Plataforma completa de e-commerce com React, Node.js e MongoDB. Inclui carrinho de compras, sistema de pagamentos e painel administrativo.",
    category: "Web Development",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Docker"],
    stars: 245,
    forks: 89,
    author: "João Silva",
    lastUpdate: "há 2 dias",
    icon: "fa-shopping-cart",
    status: "Ativo" as const
  },
  {
    id: 2,
    title: "App Mobile Fitness",
    description: "Aplicativo mobile para acompanhamento de exercícios e nutrição. Desenvolvido em React Native com integração Firebase.",
    category: "Mobile App",
    technologies: ["React Native", "Firebase", "Redux", "TypeScript"],
    stars: 189,
    forks: 67,
    author: "Maria Santos",
    lastUpdate: "há 5 dias",
    icon: "fa-dumbbell",
    status: "Em Desenvolvimento" as const
  },
  {
    id: 3,
    title: "API Gateway Microserviços",
    description: "Gateway para arquitetura de microserviços com autenticação JWT, rate limiting e monitoramento em tempo real.",
    category: "API",
    technologies: ["Node.js", "Docker", "Kubernetes", "Redis", "JWT"],
    stars: 356,
    forks: 124,
    author: "Pedro Costa",
    lastUpdate: "há 1 semana",
    icon: "fa-network-wired",
    status: "Ativo" as const
  },
  {
    id: 4,
    title: "Dashboard Analytics",
    description: "Dashboard interativo para análise de dados com gráficos em tempo real e relatórios personalizáveis.",
    category: "Web Development",
    technologies: ["Vue.js", "D3.js", "Python", "FastAPI", "PostgreSQL"],
    stars: 298,
    forks: 103,
    author: "Ana Oliveira",
    lastUpdate: "há 3 dias",
    icon: "fa-chart-bar",
    status: "Concluído" as const
  },
  {
    id: 5,
    title: "ML Previsão de Vendas",
    description: "Sistema de machine learning para previsão de vendas usando algoritmos de time series e deep learning.",
    category: "Machine Learning",
    technologies: ["Python", "TensorFlow", "Pandas", "Scikit-learn", "Docker"],
    stars: 167,
    forks: 45,
    author: "Carlos Mendes",
    lastUpdate: "há 4 dias",
    icon: "fa-brain",
    status: "Em Desenvolvimento" as const
  },
  {
    id: 6,
    title: "DevOps Pipeline",
    description: "Pipeline completo de CI/CD com testes automatizados, deploy em Kubernetes e monitoramento.",
    category: "DevOps",
    technologies: ["Jenkins", "Docker", "Kubernetes", "Terraform", "AWS"],
    stars: 432,
    forks: 178,
    author: "Rafael Lima",
    lastUpdate: "há 1 dia",
    icon: "fa-infinity",
    status: "Ativo" as const
  }
];

interface ProjectsSectionProps {
  newProjects?: any[];
}

export function ProjectsSection({ newProjects = [] }: ProjectsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [allProjects, setAllProjects] = useState(mockProjects);

  useEffect(() => {
    if (newProjects.length > 0) {
      setAllProjects(prev => [...newProjects, ...prev]);
    }
  }, [newProjects]);

  const categories = ['all', 'Web Development', 'Mobile App', 'API', 'Machine Learning', 'DevOps'];
  const statuses = ['all', 'Ativo', 'Concluído', 'Em Desenvolvimento'];

  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <section id="projetos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div data-aos="fade-up" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore os{' '}
            <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
              Projetos
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra projetos inovadores criados pela nossa comunidade de desenvolvedores
          </p>
        </div>

        {/* Filters */}
        <div data-aos="fade-up" data-aos-delay="100" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar projetos, tecnologias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'Todas as Categorias' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'Todos os Status' : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Info */}
        <div data-aos="fade-up" data-aos-delay="200" className="mb-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Encontrados {filteredProjects.length} projeto{filteredProjects.length !== 1 ? 's' : ''}
            </p>
            <Button variant="outline" className="hidden md:inline-flex">
              <i className="fas fa-sort mr-2"></i>
              Ordenar por
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div 
          data-aos="fade-up" 
          data-aos-delay="300"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <div key={project.id} data-aos="fade-up" data-aos-delay={300 + (index * 100)}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredProjects.length > 0 && (
          <div data-aos="fade-up" className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <i className="fas fa-plus mr-2"></i>
              Carregar Mais Projetos
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div data-aos="fade-up" className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-orange-100 rounded-full flex items-center justify-center">
              <i className="fas fa-search text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou termos de busca
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="bg-gradient-to-r from-green-600 to-orange-500 text-white"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}