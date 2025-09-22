import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Users, Calendar, ArrowRight } from "lucide-react";

interface FeaturedProjectsProps {
  onNavigateToProjects?: () => void;
  onNavigateToProjectDetails?: (projectId: number) => void;
}

const featuredProjects = [
  {
    id: 1,
    title: "Inteligência Artificial para Diagnóstico Médico",
    description: "Desenvolvimento de algoritmos de machine learning para auxiliar no diagnóstico precoce de doenças cardiovasculares através de análise de imagens médicas.",
    category: "Inteligência Artificial",
    institution: "UNICAMP",
    authors: "Dr. Maria Silva, Prof. João Santos",
    date: "Dezembro 2024",
    status: "Em Andamento",
    tags: ["IA", "Medicina", "Machine Learning"],
    image: "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwbWVkaWNhbCUyMGltYWdpbmd8ZW58MXx8fHwxNzU4MzMyNjgxfDA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  },
  {
    id: 2,
    title: "Sustentabilidade em Sistemas Urbanos",
    description: "Pesquisa sobre implementação de tecnologias verdes em grandes centros urbanos, focando em redução de emissões de carbono e eficiência energética.",
    category: "Sustentabilidade",
    institution: "USP",
    authors: "Dra. Ana Costa, Prof. Carlos Lima",
    date: "Novembro 2024",
    status: "Publicado",
    tags: ["Sustentabilidade", "Urbanismo", "Energia"],
    image: "https://images.unsplash.com/photo-1631009630535-4c13cc6215f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGRlbGl2ZXJ5JTIwYXBwJTIwbW9iaWxlfGVufDF8fHx8MTc1ODMzMjY5NHww&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  },
  {
    id: 3,
    title: "Blockchain para Transparência Governamental",
    description: "Estudo sobre a aplicação de tecnologia blockchain para aumentar a transparência e eficiência em processos governamentais e votações eletrônicas.",
    category: "Tecnologia",
    institution: "ITA",
    authors: "Prof. Roberto Oliveira, Dra. Lucia Pereira",
    date: "Janeiro 2025",
    status: "Em Revisão",
    tags: ["Blockchain", "Governo", "Transparência"],
    image: "https://images.unsplash.com/photo-1631864032970-68d79f6b7158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdm90aW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTgzMzI2ODh8MA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  }
];

export function FeaturedProjects({ onNavigateToProjects, onNavigateToProjectDetails }: FeaturedProjectsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Projetos em Destaque
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça alguns dos projetos mais inovadores e impactantes 
            da nossa comunidade acadêmica
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
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {project.title}
                </h3>

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