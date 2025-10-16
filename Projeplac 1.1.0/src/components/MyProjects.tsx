import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  ExternalLink, 
  Users, 
  Calendar, 
  Youtube,
  Github,
  BarChart3,
  Filter,
  Eye
} from "lucide-react";
import { useState } from "react";

interface MyProjectsProps {
  onBack: () => void;
  onNavigateToProjectDetails?: (projectId: number) => void;
}

// Mock data dos projetos do usuário - em um app real, isso viria de uma API
const userProjects = [
  {
    id: 1,
    title: "Sistema de Gestão Acadêmica",
    description: "Plataforma web para gerenciamento de alunos, professores e disciplinas com interface moderna e responsiva.",
    category: "Engenharia de Software",
    course: "Engenharia de Software",
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
    views: 245,
    likes: 18,
    image: "https://images.unsplash.com/photo-1636034890787-84c842228065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMG1hbmFnZW1lbnQlMjBzeXN0ZW0lMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU4MzMyNjc1fDA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  },
  {
    id: 5,
    title: "Blockchain para Votação Eletrônica",
    description: "Sistema de votação descentralizado usando blockchain para garantir transparência e segurança.",
    category: "Engenharia de Software",
    course: "Engenharia de Software",
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
    views: 189,
    likes: 12,
    image: "https://images.unsplash.com/photo-1631864032970-68d79f6b7158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdm90aW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTgzMzI2ODh8MA&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  },
  {
    id: 7,
    title: "App de Delivery Sustentável",
    description: "Aplicativo mobile para delivery de alimentos com foco em sustentabilidade e redução de desperdício.",
    category: "Engenharia de Software",
    course: "Engenharia de Software",
    professor: "Prof. Carlos Lima",
    semester: "8º Semestre",
    shift: "Noturno",
    class: "ES-2024-2",
    date: "Em desenvolvimento",
    status: "Em Andamento",
    tags: ["React Native", "Firebase", "Node.js"],
    projectLink: "",
    youtubeLink: "",
    githubLink: "https://github.com/joao/eco-delivery",
    views: 67,
    likes: 5,
    image: "https://images.unsplash.com/photo-1631009630535-4c13cc6215f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGRlbGl2ZXJ5JTIwYXBwJTIwbW9iaWxlfGVufDF8fHx8MTc1ODMzMjY5NHww&ixlib=rb-4.1.0&q=80&w=400&h=200&fit=crop"
  }
];

export function MyProjects({ onBack, onNavigateToProjectDetails }: MyProjectsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  const filteredProjects = userProjects.filter(project => {
    return (
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (selectedStatus === "all" || project.status === selectedStatus);
  });

  const handleDeleteProject = (projectId: number) => {
    // TODO: Implementar exclusão do projeto
    console.log('Deletando projeto:', projectId);
    setProjectToDelete(null);
  };

  const stats = {
    total: userProjects.length,
    completed: userProjects.filter(p => p.status === 'Concluído').length,
    inProgress: userProjects.filter(p => p.status === 'Em Andamento').length,
    totalViews: userProjects.reduce((sum, p) => sum + p.views, 0),
    totalLikes: userProjects.reduce((sum, p) => sum + p.likes, 0)
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header da Página */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Meus Projetos</h1>
              <p className="text-muted-foreground">
                Gerencie e acompanhe todos os seus projetos acadêmicos
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 self-start lg:self-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="projects">Meus Projetos</TabsTrigger>
            <TabsTrigger value="analytics">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            {/* Barra de Pesquisa e Filtros */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Pesquisar nos meus projetos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
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
                </div>
              </div>

              {/* Contadores */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Mostrando {filteredProjects.length} de {userProjects.length} projetos
                </span>
                <span>
                  {stats.completed} concluídos • {stats.inProgress} em andamento
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
                    <div className="absolute top-4 right-4 flex space-x-1">
                      <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white" title="Ver Detalhes">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white" title="Editar Projeto">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white" title="Excluir Projeto">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Projeto</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o projeto "{project.title}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
                        {project.professor}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {project.date} • {project.class}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {project.views} visualizações
                        </span>
                        <span>{project.likes} curtidas</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={() => onNavigateToProjectDetails?.(project.id)}
                      >
                        Ver Detalhes
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <div className="p-3 bg-muted rounded-full w-fit mx-auto">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Não encontramos projetos com os filtros aplicados.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                }}>
                  Limpar Filtros
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            {/* Estatísticas dos Projetos */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Suas Estatísticas</h3>
              
              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-primary mb-1">{stats.total}</h4>
                  <p className="text-muted-foreground">Total de Projetos</p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-green-600 mb-1">{stats.completed}</h4>
                  <p className="text-muted-foreground">Projetos Concluídos</p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-secondary/10 rounded-full">
                      <Calendar className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-secondary mb-1">{stats.inProgress}</h4>
                  <p className="text-muted-foreground">Em Andamento</p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-blue-600 mb-1">{stats.totalViews}</h4>
                  <p className="text-muted-foreground">Total de Visualizações</p>
                </Card>
              </div>

              {/* Projetos por Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Projetos por Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Concluídos</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <Badge className="bg-green-500 text-white">{stats.completed}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Em Andamento</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-secondary h-2 rounded-full" 
                            style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <Badge variant="secondary">{stats.inProgress}</Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Projeto Mais Visualizado</h4>
                  {userProjects.length > 0 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <h5 className="font-medium text-foreground">
                          {userProjects.reduce((prev, current) => 
                            prev.views > current.views ? prev : current
                          ).title}
                        </h5>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {userProjects.reduce((prev, current) => 
                              prev.views > current.views ? prev : current
                            ).views} visualizações
                          </span>
                          <span>
                            {userProjects.reduce((prev, current) => 
                              prev.views > current.views ? prev : current
                            ).likes} curtidas
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Lista Detalhada dos Projetos */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Todos os Projetos</h4>
                <div className="space-y-3">
                  {userProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground">{project.title}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={project.status === 'Concluído' ? 'border-green-500 text-green-600' : 'border-secondary text-secondary'}
                          >
                            {project.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{project.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {project.views}
                        </span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}