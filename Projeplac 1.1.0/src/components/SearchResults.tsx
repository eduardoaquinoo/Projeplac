import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ProfileIcon } from "./ProfileIcon";
import { ArrowLeft, Search, Filter, X, ExternalLink, Users, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

interface SearchResultsProps {
  onBack: () => void;
  onNavigateToProjectDetails: (projectId: number) => void;
  initialSearchTerm?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  institution: string;
  authors: string;
  date: string;
  status: string;
  tags: string[];
  image: string;
  course?: string;
  professor?: string;
  members?: string[];
}

// Base de dados consolidada de todos os projetos do site
const allProjects: Project[] = [
  {
    id: 1,
    title: "Inteligência Artificial para Diagnóstico Médico",
    description: "Desenvolvimento de algoritmos de machine learning para auxiliar no diagnóstico precoce de doenças cardiovasculares através de análise de imagens médicas.",
    category: "Inteligência Artificial",
    institution: "UNICEPLAC",
    authors: "Maria Silva",
    date: "Dezembro 2024",
    status: "Em Andamento",
    tags: ["IA", "Medicina", "Machine Learning", "Saúde", "Python"],
    image: "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwbWVkaWNhbCUyMGltYWdpbmd8ZW58MXx8fHwxNzU4MzMyNjgxfDA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop",
    course: "Ciência da Computação",
    professor: "Prof. João Santos",
    members: ["Maria Silva", "Carlos Henrique"]
  },
  {
    id: 2,
    title: "Sustentabilidade em Sistemas Urbanos",
    description: "Pesquisa sobre implementação de tecnologias verdes em grandes centros urbanos, focando em redução de emissões de carbono e eficiência energética.",
    category: "Sustentabilidade",
    institution: "UNICEPLAC",
    authors: "Ana Costa",
    date: "Novembro 2024",
    status: "Publicado",
    tags: ["Sustentabilidade", "Urbanismo", "Energia", "IoT", "Meio Ambiente"],
    image: "https://images.unsplash.com/photo-1631009630535-4c13cc6215f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGRlbGl2ZXJ5JTIwYXBwJTIwbW9iaWxlfGVufDF8fHx8MTc1ODMzMjY5NHww&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop",
    course: "Engenharia de Software",
    professor: "Prof. Carlos Lima",
    members: ["Ana Costa", "Bruno Almeida"]
  },
  {
    id: 3,
    title: "Blockchain para Transparência Governamental",
    description: "Estudo sobre a aplicação de tecnologia blockchain para aumentar a transparência e eficiência em processos governamentais e votações eletrônicas.",
    category: "Tecnologia",
    institution: "UNICEPLAC",
    authors: "Lucia Pereira",
    date: "Janeiro 2025",
    status: "Em Revisão",
    tags: ["Blockchain", "Governo", "Transparência", "Web3", "Criptografia"],
    image: "https://images.unsplash.com/photo-1631864032970-68d79f6b7158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdm90aW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTgzMzI2ODh8MA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop",
    course: "Sistemas de Informação",
    professor: "Prof. Roberto Oliveira",
    members: ["Lucia Pereira", "Fernando Costa"]
  },
  {
    id: 4,
    title: "Sistema de Gestão Acadêmica",
    description: "Plataforma web completa para gerenciamento de notas, frequência e desempenho dos alunos, com dashboard intuitivo para professores e coordenadores.",
    category: "Educação",
    institution: "UNICEPLAC",
    authors: "João Silva",
    date: "Outubro 2024",
    status: "Publicado",
    tags: ["Web", "React", "Node.js", "Educação", "Dashboard"],
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU4MzMyNzA0fDA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop",
    course: "Engenharia de Software",
    professor: "Prof. Eduardo Aquino",
    members: ["João Silva", "Maria Santos"]
  },
  {
    id: 5,
    title: "App de Mobilidade Urbana",
    description: "Aplicativo mobile para otimização de rotas de transporte público, com integração de dados em tempo real e sugestões inteligentes de trajetos.",
    category: "Mobilidade",
    institution: "UNICEPLAC",
    authors: "Pedro Oliveira",
    date: "Setembro 2024",
    status: "Em Andamento",
    tags: ["Mobile", "React Native", "GPS", "API", "Maps"],
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjB0cmFuc3BvcnR8ZW58MXx8fHwxNzU4MzMyNzEwfDA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop",
    course: "Análise e Desenvolvimento de Sistemas",
    professor: "Prof. Mariana Rocha",
    members: ["Pedro Oliveira", "Laura Costa"]
  },
  {
    id: 6,
    title: "Chatbot de Atendimento com IA",
    description: "Sistema de atendimento automatizado utilizando processamento de linguagem natural e machine learning para melhorar a experiência do usuário.",
    category: "Inteligência Artificial",
    institution: "UNICEPLAC",
    authors: "Carlos Mendes",
    date: "Agosto 2024",
    status: "Publicado",
    tags: ["IA", "NLP", "Chatbot", "Python", "Machine Learning"],
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGF0Ym90JTIwYXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZXxlbnwxfHx8fDE3NTgzMzI3MTZ8MA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop",
    course: "Ciência da Computação",
    professor: "Prof. João Santos",
    members: ["Carlos Mendes", "Julia Ferreira"]
  },
  {
    id: 7,
    title: "Dashboard de Analytics em Tempo Real",
    description: "Painel de visualização de dados e métricas em tempo real para análise de negócios, com gráficos interativos e relatórios customizáveis.",
    category: "Data Science",
    institution: "UNICEPLAC",
    authors: "Ana Paula Silva",
    date: "Julho 2024",
    status: "Em Revisão",
    tags: ["Analytics", "Dashboard", "Data Visualization", "React", "TypeScript"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc1ODMzMjcyMnww&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop",
    course: "Sistemas de Informação",
    professor: "Prof. Roberto Oliveira",
    members: ["Ana Paula Silva", "Ricardo Santos"]
  },
  {
    id: 8,
    title: "Sistema de Reserva de Salas",
    description: "Plataforma para agendamento de espaços acadêmicos com calendário integrado, notificações automáticas e controle de disponibilidade.",
    category: "Educação",
    institution: "UNICEPLAC",
    authors: "Fernando Lima",
    date: "Junho 2024",
    status: "Publicado",
    tags: ["Web", "Vue.js", "Calendar", "Reservas", "Firebase"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29tJTIwYm9va2luZyUyMHN5c3RlbXxlbnwxfHx8fDE3NTgzMzI3Mjh8MA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop",
    course: "Engenharia de Software",
    professor: "Prof. Eduardo Aquino",
    members: ["Fernando Lima", "Beatriz Souza", "André Silva"]
  },
  {
    id: 9,
    title: "E-commerce com Realidade Aumentada",
    description: "Plataforma de comércio eletrônico que utiliza AR para visualização de produtos em ambiente real antes da compra.",
    category: "E-commerce",
    institution: "UNICEPLAC",
    authors: "Gabriel Alves",
    date: "Maio 2024",
    status: "Em Andamento",
    tags: ["AR", "E-commerce", "Mobile", "Unity", "3D"],
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdWdtZW50ZWQlMjByZWFsaXR5JTIwc2hvcHBpbmd8ZW58MXx8fHwxNzU4MzMyNzM0fDA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop",
    course: "Análise e Desenvolvimento de Sistemas",
    professor: "Prof. Mariana Rocha",
    members: ["Gabriel Alves", "Camila Torres"]
  },
  {
    id: 10,
    title: "Sistema de Monitoramento Ambiental com IoT",
    description: "Rede de sensores IoT para monitoramento de qualidade do ar, temperatura e umidade em tempo real com alertas automatizados.",
    category: "IoT",
    institution: "UNICEPLAC",
    authors: "Lucas Rodrigues",
    date: "Abril 2024",
    status: "Publicado",
    tags: ["IoT", "Sensores", "Arduino", "MQTT", "Cloud"],
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpb3QlMjBlbnZpcm9ubWVudGFsJTIwbW9uaXRvcmluZ3xlbnwxfHx8fDE3NTgzMzI3NDB8MA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop",
    course: "Engenharia de Software",
    professor: "Prof. Carlos Lima",
    members: ["Lucas Rodrigues", "Mariana Costa"]
  }
];

export function SearchResults({ onBack, onNavigateToProjectDetails, initialSearchTerm = "" }: SearchResultsProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(allProjects);

  // Extrair todas as tags únicas dos projetos, incluindo professores
  const allTags = Array.from(new Set([
    ...allProjects.flatMap(p => p.tags),
    ...allProjects.filter(p => p.professor).map(p => p.professor!)
  ])).sort();

  useEffect(() => {
    filterProjects();
  }, [searchTerm, selectedTags]);

  const filterProjects = () => {
    let results = allProjects;

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.authors.toLowerCase().includes(searchLower) ||
        project.category.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        project.course?.toLowerCase().includes(searchLower) ||
        project.professor?.toLowerCase().includes(searchLower) ||
        project.members?.some(member => member.toLowerCase().includes(searchLower))
      );
    }

    // Filtrar por tags selecionadas (incluindo tag de professor)
    if (selectedTags.length > 0) {
      results = results.filter(project => {
        // Verifica se as tags normais do projeto correspondem
        const hasAllTags = selectedTags.every(tag => {
          // Se a tag começar com "Prof.", verifica se é o professor do projeto
          if (tag.startsWith("Prof.")) {
            return project.professor === tag;
          }
          return project.tags.includes(tag);
        });
        return hasAllTags;
      });
    }

    setFilteredProjects(results);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center space-x-2 text-primary hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <div className="flex items-center space-x-3">
                <img 
                  src={projeplacLogo} 
                  alt="Projeplac Logo" 
                  className="h-10 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold">
                    <span className="text-primary">Proje</span>
                    <span className="text-secondary">plac</span>
                  </h1>
                  <p className="text-sm text-muted-foreground">Resultados da Pesquisa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de Pesquisa */}
        <Card className="mb-6 p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Pesquisar por título, autor, tecnologia, curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 h-12 text-base"
              />
            </div>

            {/* Tags Populares */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  Filtrar por Tags
                </label>
                {(selectedTags.length > 0 || searchTerm) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpar Filtros
                  </Button>
                )}
              </div>

              {/* Tags de Professores */}
              <div className="mb-3">
                <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <ProfileIcon type="professor" size="sm" />
                  <span>Professores Orientadores</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.filter(tag => tag.startsWith("Prof.")).map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                          : "hover:bg-secondary/10 border-secondary/30"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      <ProfileIcon type="professor" size="sm" className="mr-1" />
                      {tag}
                      {selectedTags.includes(tag) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags de Tecnologia */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Tecnologias e Áreas
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.filter(tag => !tag.startsWith("Prof.")).map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Resultados */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {filteredProjects.length} projeto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
          </h2>
          {selectedTags.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Filtrado por: {selectedTags.join(", ")}
            </div>
          )}
        </div>

        {filteredProjects.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os termos de busca ou remover alguns filtros
            </p>
            <Button onClick={clearAllFilters} variant="outline">
              Limpar Filtros
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => onNavigateToProjectDetails(project.id)}
              >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToProjectDetails(project.id);
                      }}
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
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Metadados */}
                  <div className="flex flex-col space-y-2 text-sm text-muted-foreground border-t border-border pt-4">
                    {/* Professor */}
                    {project.professor && (
                      <div className="flex items-center gap-2">
                        <ProfileIcon type="professor" size="sm" />
                        <span className="line-clamp-1">{project.professor}</span>
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-secondary/20 text-secondary border-secondary/30 cursor-pointer hover:bg-secondary/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTag(project.professor!);
                          }}
                        >
                          Orientador
                        </Badge>
                      </div>
                    )}
                    
                    {/* Membros */}
                    {project.members && project.members.length > 0 && (
                      <div className="flex items-center gap-2">
                        <ProfileIcon type="aluno" size="sm" />
                        <span className="line-clamp-1">
                          {project.members.length} {project.members.length === 1 ? 'membro' : 'membros'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{project.date}</span>
                      </div>
                      {project.course && (
                        <Badge variant="secondary" className="text-xs">
                          {project.course}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
