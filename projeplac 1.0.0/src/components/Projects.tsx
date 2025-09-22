import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Users, 
  Calendar, 
  ArrowLeft,
  Code, 
  Database, 
  Computer, 
  Network,
  Youtube,
  Github
} from "lucide-react";
import { useState } from "react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

interface ProjectsProps {
  onBack: () => void;
  onNavigateToProjectDetails?: (projectId: number) => void;
}

const categories = [
  {
    id: 1,
    name: "Engenharia de Software",
    icon: Code,
    count: 12,
    color: "bg-primary",
    description: "Desenvolvimento, Arquitetura, Metodologias Ágeis"
  },
  {
    id: 2,
    name: "Análise e Desenvolvimento de Sistemas",
    icon: Database,
    count: 8,
    color: "bg-secondary",
    description: "Análise de Requisitos, Modelagem, Desenvolvimento"
  },
  {
    id: 3,
    name: "Ciência da Computação",
    icon: Computer,
    count: 15,
    color: "bg-primary",
    description: "Algoritmos, Estruturas de Dados, Inteligência Artificial"
  },
  {
    id: 4,
    name: "Sistemas de Informação",
    icon: Network,
    count: 6,
    color: "bg-secondary",
    description: "Gestão de TI, Business Intelligence, ERP"
  }
];

const projects = [
  {
    id: 1,
    title: "Sistema de Gestão Acadêmica",
    description: "Plataforma web para gerenciamento de alunos, professores e disciplinas com interface moderna e responsiva.",
    category: "Engenharia de Software",
    course: "Engenharia de Software",
    author: "João Silva",
    professor: "Prof. Dr. Maria Santos",
    semester: "8º Semestre",
    shift: "Noturno",
    class: "ES-2024-2",
    date: "Dezembro 2024",
    status: "Concluído",
    tags: ["React", "Node.js", "PostgreSQL"],
    projectLink: "https://github.com/joao/sistema-academico",
    youtubeLink: "https://youtube.com/watch?v=exemplo1",
    githubLink: "https://github.com/joao/sistema-academico",
    image: "https://images.unsplash.com/photo-1636034890787-84c842228065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMG1hbmFnZW1lbnQlMjBzeXN0ZW0lMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU4MzMyNjc1fDA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  },
  {
    id: 2,
    title: "App Mobile para Controle Financeiro",
    description: "Aplicativo React Native para controle de finanças pessoais com gráficos e relatórios detalhados.",
    category: "Análise e Desenvolvimento de Sistemas",
    course: "Análise e Desenvolvimento de Sistemas",
    author: "Ana Costa",
    professor: "Prof. Carlos Lima",
    semester: "6º Semestre",
    shift: "Matutino",
    class: "ADS-2024-1",
    date: "Novembro 2024",
    status: "Em Andamento",
    tags: ["React Native", "Firebase", "Charts"],
    projectLink: "https://github.com/ana/finance-app",
    youtubeLink: "https://youtube.com/watch?v=exemplo2",
    githubLink: "https://github.com/ana/finance-app",
    image: "https://images.unsplash.com/photo-1613442301287-4fa478efd9ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBmaW5hbmNlJTIwYXBwJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc1ODMzMjY3OHww&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  },
  {
    id: 3,
    title: "IA para Reconhecimento de Padrões",
    description: "Algoritmo de machine learning para reconhecimento de padrões em imagens médicas usando TensorFlow.",
    category: "Ciência da Computação",
    course: "Ciência da Computação",
    author: "Pedro Oliveira",
    professor: "Prof. Dra. Lucia Pereira",
    semester: "7º Semestre",
    shift: "Vespertino",
    class: "CC-2024-2",
    date: "Janeiro 2025",
    status: "Em Revisão",
    tags: ["Python", "TensorFlow", "OpenCV"],
    projectLink: "https://github.com/pedro/ia-padroes",
    youtubeLink: "https://youtube.com/watch?v=exemplo3",
    githubLink: "https://github.com/pedro/ia-padroes",
    image: "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwbWVkaWNhbCUyMGltYWdpbmd8ZW58MXx8fHwxNzU4MzMyNjgxfDA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Sistema ERP para PMEs",
    description: "Solução completa de gestão empresarial para pequenas e médias empresas com módulos integrados.",
    category: "Sistemas de Informação",
    course: "Sistemas de Informação",
    author: "Mariana Santos",
    professor: "Prof. Roberto Oliveira",
    semester: "8º Semestre",
    shift: "Noturno",
    class: "SI-2024-2",
    date: "Dezembro 2024",
    status: "Publicado",
    tags: ["Java", "Spring", "MySQL"],
    projectLink: "https://github.com/mariana/erp-pme",
    youtubeLink: "https://youtube.com/watch?v=exemplo4",
    githubLink: "https://github.com/mariana/erp-pme",
    image: "https://images.unsplash.com/photo-1728917330520-9456e3f49529?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGVycCUyMHN5c3RlbSUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTgzMzIyODV8MA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  },
  {
    id: 5,
    title: "Blockchain para Votação Eletrônica",
    description: "Sistema de votação descentralizado usando blockchain para garantir transparência e segurança.",
    category: "Engenharia de Software",
    course: "Engenharia de Software",
    author: "Lucas Ferreira",
    professor: "Prof. Dr. Maria Santos",
    semester: "7º Semestre",
    shift: "Matutino",
    class: "ES-2024-1",
    date: "Outubro 2024",
    status: "Concluído",
    tags: ["Solidity", "Web3", "React"],
    projectLink: "https://github.com/lucas/voting-blockchain",
    youtubeLink: "https://youtube.com/watch?v=exemplo5",
    githubLink: "https://github.com/lucas/voting-blockchain",
    image: "https://images.unsplash.com/photo-1631864032970-68d79f6b7158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdm90aW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTgzMzIyODh8MA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  },
  {
    id: 6,
    title: "Dashboard de Analytics",
    description: "Plataforma de visualização de dados com dashboards interativos para análise de métricas empresariais.",
    category: "Análise e Desenvolvimento de Sistemas",
    course: "Análise e Desenvolvimento de Sistemas",
    author: "Sofia Rodriguez",
    professor: "Prof. Carlos Lima",
    semester: "5º Semestre",
    shift: "Vespertino",
    class: "ADS-2024-2",
    date: "Janeiro 2025",
    status: "Em Andamento",
    tags: ["Vue.js", "D3.js", "MongoDB"],
    projectLink: "https://github.com/sofia/analytics-dashboard",
    youtubeLink: "https://youtube.com/watch?v=exemplo6",
    githubLink: "https://github.com/sofia/analytics-dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwdmlzdWFsaXphdGlvbnxlbnwxfHx8fDE3NTgyNjc3NzV8MA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  }
];

export function Projects({ onBack, onNavigateToProjectDetails }: ProjectsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedProfessor, setSelectedProfessor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredProjects = projects.filter(project => {
    return (
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.author.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (selectedCourse === "" || selectedCourse === "all" || project.course === selectedCourse) &&
    (selectedClass === "" || selectedClass === "all" || project.class === selectedClass) &&
    (selectedShift === "" || selectedShift === "all" || project.shift === selectedShift) &&
    (selectedSemester === "" || selectedSemester === "all" || project.semester === selectedSemester) &&
    (selectedProfessor === "" || selectedProfessor === "all" || project.professor === selectedProfessor) &&
    (selectedStatus === "" || selectedStatus === "all" || project.status === selectedStatus);
  });

  const uniqueClasses = [...new Set(projects.map(p => p.class))];
  const uniqueProfessors = [...new Set(projects.map(p => p.professor))];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCourse("all");
    setSelectedClass("all");
    setSelectedShift("all");
    setSelectedSemester("all");
    setSelectedProfessor("all");
    setSelectedStatus("all");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hub de Projetos Acadêmicos
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore todos os projetos desenvolvidos pelos estudantes da UNICEPLAC. 
            Use os filtros para encontrar projetos específicos por curso, turma, professor e muito mais.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">Todos os Projetos</TabsTrigger>
            <TabsTrigger value="courses">Por Curso</TabsTrigger>
            <TabsTrigger value="filters">Filtros Avançados</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="featured">Em Destaque</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {/* Barra de Pesquisa e Filtros Básicos */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Pesquisar projetos, autores ou tecnologias..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por Curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Cursos</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Em Revisão">Em Revisão</SelectItem>
                      <SelectItem value="Publicado">Publicado</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={clearFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </div>
              </div>

              {/* Contadores */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Mostrando {filteredProjects.length} de {projects.length} projetos
                </span>
                <span>
                  Total de {projects.length} projetos cadastrados
                </span>
              </div>
            </div>

            {/* Lista de Projetos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
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
                                  project.status === 'Concluído' ? 'bg-green-500 text-white' :
                                  project.status === 'Em Andamento' ? 'bg-secondary text-secondary-foreground' : 
                                  'bg-muted text-muted-foreground'}
                      >
                        {project.status}
                      </Badge>
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
                        {project.author}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {project.date} • {project.class}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {project.professor} • {project.semester} • {project.shift}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => onNavigateToProjectDetails?.(project.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum projeto encontrado com os filtros aplicados.
                </p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Limpar Filtros
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="courses">
            {/* Seção Explore por Curso */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                Explore Projetos por Curso
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card 
                      key={category.id} 
                      className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                      onClick={() => setSelectedCourse(category.name)}
                    >
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className={`p-3 ${category.color} rounded-full text-white group-hover:scale-110 transition-transform`}>
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-foreground mb-2">
                          {category.name}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {category.description}
                        </p>
                        
                        <div className="text-sm font-medium text-primary mb-4">
                          {category.count} projetos
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                          Explorar
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="filters">
            {/* Filtros Avançados */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Filtros Avançados
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="course-filter">Curso</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Cursos</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="class-filter">Turma</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Turmas</SelectItem>
                      {uniqueClasses.map(className => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="shift-filter">Turno</Label>
                  <Select value={selectedShift} onValueChange={setSelectedShift}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Turnos</SelectItem>
                      <SelectItem value="Matutino">Matutino</SelectItem>
                      <SelectItem value="Vespertino">Vespertino</SelectItem>
                      <SelectItem value="Noturno">Noturno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="semester-filter">Semestre</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Semestres</SelectItem>
                      <SelectItem value="1º Semestre">1º Semestre</SelectItem>
                      <SelectItem value="2º Semestre">2º Semestre</SelectItem>
                      <SelectItem value="3º Semestre">3º Semestre</SelectItem>
                      <SelectItem value="4º Semestre">4º Semestre</SelectItem>
                      <SelectItem value="5º Semestre">5º Semestre</SelectItem>
                      <SelectItem value="6º Semestre">6º Semestre</SelectItem>
                      <SelectItem value="7º Semestre">7º Semestre</SelectItem>
                      <SelectItem value="8º Semestre">8º Semestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="professor-filter">Professor</Label>
                  <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o professor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Professores</SelectItem>
                      {uniqueProfessors.map(professor => (
                        <SelectItem key={professor} value={professor}>
                          {professor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Em Revisão">Em Revisão</SelectItem>
                      <SelectItem value="Publicado">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={clearFilters} variant="outline">
                  Limpar Todos os Filtros
                </Button>
                <Button>
                  Aplicar Filtros
                </Button>
              </div>
            </div>

            {/* Resultados dos Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
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
                                  project.status === 'Concluído' ? 'bg-green-500 text-white' :
                                  project.status === 'Em Andamento' ? 'bg-secondary text-secondary-foreground' : 
                                  'bg-muted text-muted-foreground'}
                      >
                        {project.status}
                      </Badge>
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
                        {project.author}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {project.date} • {project.class}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {project.professor} • {project.semester} • {project.shift}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => onNavigateToProjectDetails?.(project.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            {/* Estatísticas */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-foreground text-center">
                Estatísticas dos Projetos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 text-center">
                  <h4 className="text-2xl font-bold text-primary mb-2">{projects.length}</h4>
                  <p className="text-muted-foreground">Total de Projetos</p>
                </Card>
                
                <Card className="p-6 text-center">
                  <h4 className="text-2xl font-bold text-secondary mb-2">
                    {projects.filter(p => p.status === 'Concluído').length}
                  </h4>
                  <p className="text-muted-foreground">Projetos Concluídos</p>
                </Card>
                
                <Card className="p-6 text-center">
                  <h4 className="text-2xl font-bold text-primary mb-2">
                    {projects.filter(p => p.status === 'Em Andamento').length}
                  </h4>
                  <p className="text-muted-foreground">Em Andamento</p>
                </Card>
                
                <Card className="p-6 text-center">
                  <h4 className="text-2xl font-bold text-secondary mb-2">
                    {uniqueProfessors.length}
                  </h4>
                  <p className="text-muted-foreground">Professores Orientadores</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Projetos por Curso</h4>
                  <div className="space-y-3">
                    {categories.map(category => (
                      <div key={category.id} className="flex justify-between items-center">
                        <span className="text-muted-foreground">{category.name}</span>
                        <Badge variant="outline">{category.count} projetos</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Projetos por Turno</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Matutino</span>
                      <Badge variant="outline">
                        {projects.filter(p => p.shift === 'Matutino').length} projetos
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Vespertino</span>
                      <Badge variant="outline">
                        {projects.filter(p => p.shift === 'Vespertino').length} projetos
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Noturno</span>
                      <Badge variant="outline">
                        {projects.filter(p => p.shift === 'Noturno').length} projetos
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="featured">
            {/* Projetos em Destaque */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-foreground text-center">
                Projetos em Destaque
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.filter(p => p.status === 'Publicado' || p.status === 'Concluído').map((project) => (
                  <Card key={project.id} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className="bg-primary text-primary-foreground">
                        ⭐ Destaque
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" title="Ver Projeto">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="YouTube">
                          <Youtube className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button variant="ghost" size="sm" title="GitHub">
                          <Github className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {project.author}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {project.date} • {project.class}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Ver Detalhes
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}