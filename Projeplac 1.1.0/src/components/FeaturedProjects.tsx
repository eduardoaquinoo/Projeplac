import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Users, Calendar, ArrowRight, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { getCombinedFeatured, getLikesCount } from "../utils/likesManager";

interface FeaturedProjectsProps {
  onNavigateToProjects?: () => void;
  onNavigateToProjectDetails?: (projectId: number) => void;
}

const allProjects = [
  {
    id: 1,
    title: "Sistema de Gestão Acadêmica",
    description: "Plataforma web completa para gerenciamento de alunos, professores e disciplinas com interface moderna e responsiva.",
    category: "Engenharia de Software",
    institution: "UNICEPLAC",
    authors: "João Silva",
    date: "Dezembro 2024",
    status: "Concluído",
    tags: ["React", "Node.js", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
  },
  {
    id: 2,
    title: "App Mobile para Controle Financeiro",
    description: "Aplicativo React Native para controle de finanças pessoais com gráficos e relatórios detalhados.",
    category: "Análise e Desenvolvimento de Sistemas",
    institution: "UNICEPLAC",
    authors: "Ana Costa",
    date: "Novembro 2024",
    status: "Publicado",
    tags: ["React Native", "Firebase", "Charts"],
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Sistema de E-commerce com IA",
    description: "Plataforma de comércio eletrônico com recomendações personalizadas usando machine learning.",
    category: "Ciência da Computação",
    institution: "UNICEPLAC",
    authors: "Pedro Oliveira",
    date: "Janeiro 2025",
    status: "Em Andamento",
    tags: ["Python", "TensorFlow", "Django"],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=400&fit=crop"
  },
  {
    id: 4,
    title: "Sistema ERP para PMEs",
    description: "Solução completa de gestão empresarial para pequenas e médias empresas com módulos integrados.",
    category: "Sistemas de Informação",
    institution: "UNICEPLAC",
    authors: "Mariana Santos",
    date: "Dezembro 2024",
    status: "Publicado",
    tags: ["Java", "Spring", "MySQL"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
  },
  {
    id: 5,
    title: "Blockchain para Votação Eletrônica",
    description: "Sistema de votação descentralizado usando blockchain para garantir transparência e segurança.",
    category: "Engenharia de Software",
    institution: "UNICEPLAC",
    authors: "Lucas Ferreira",
    date: "Outubro 2024",
    status: "Concluído",
    tags: ["Solidity", "Web3", "React"],
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=400&fit=crop"
  },
  {
    id: 6,
    title: "Dashboard de Analytics",
    description: "Plataforma de visualização de dados com dashboards interativos para análise de métricas empresariais.",
    category: "Análise e Desenvolvimento de Sistemas",
    institution: "UNICEPLAC",
    authors: "Sofia Rodriguez",
    date: "Janeiro 2025",
    status: "Em Andamento",
    tags: ["Vue.js", "D3.js", "MongoDB"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
  }
];

export function FeaturedProjects({ onNavigateToProjects, onNavigateToProjectDetails }: FeaturedProjectsProps) {
  const [featuredProjects, setFeaturedProjects] = useState<typeof allProjects>([]);
  const [projectLikes, setProjectLikes] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    // Passa todos os IDs de projetos disponíveis para garantir que sempre mostre 6
    const allProjectIds = allProjects.map(p => p.id);
    
    // Obtém IDs dos projetos em destaque (manual + mais curtidos + fallback)
    const featuredIds = getCombinedFeatured(6, allProjectIds);
    
    // Filtra os projetos para mostrar apenas os em destaque
    const featured = allProjects.filter(p => featuredIds.includes(p.id));
    
    // Ordena pela ordem dos IDs retornados (manual primeiro, depois mais curtidos, depois ordem padrão)
    featured.sort((a, b) => featuredIds.indexOf(a.id) - featuredIds.indexOf(b.id));
    
    setFeaturedProjects(featured);

    // Carrega contagem de likes
    const likes: { [key: number]: number } = {};
    allProjects.forEach(p => {
      likes[p.id] = getLikesCount(p.id);
    });
    setProjectLikes(likes);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Projetos em Destaque
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça os projetos mais populares e destaques escolhidos 
            da nossa comunidade acadêmica da UNICEPLAC
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* Imagem do Projeto */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant="secondary" 
                    className={project.status === 'Publicado' ? 'bg-primary text-primary-foreground' : 
                              project.status === 'Em Andamento' ? 'bg-secondary text-secondary-foreground' : 
                              'bg-muted text-muted-foreground'}
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-white/90 hover:bg-white"
                    onClick={() => onNavigateToProjectDetails?.(project.id)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
                    {project.title}
                  </h3>
                  {projectLikes[project.id] > 0 && (
                    <div className="flex items-center gap-1 text-destructive ml-2">
                      <Heart className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{projectLikes[project.id]}</span>
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {project.authors}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {project.date} • {project.institution}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full" variant="outline" onClick={() => onNavigateToProjectDetails?.(project.id)}>
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={onNavigateToProjects}
          >
            Explorar Projetos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}