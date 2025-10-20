import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { 
  ArrowLeft, 
  Shield, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  Filter,
  BarChart3,
  Users,
  FolderKanban,
  Star,
  Heart
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";
import { api, Project, ProjectStatus, StatsResponse } from "../utils/api";
import { getManualFeatured, toggleManualFeatured, isManualFeatured, getLikesCount } from "../utils/likesManager";

interface AdminDashboardProps {
  onBack: () => void;
  onLogout: () => void;
}

const formatDate = (value: string | null | undefined) => {
  if (!value) return "Data não informada";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export function AdminDashboard({ onBack, onLogout }: AdminDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingProjectId, setUpdatingProjectId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCourse, setFilterCourse] = useState<string>("all");
  const [featuredProjects, setFeaturedProjects] = useState<number[]>([]);
  const [projectLikes, setProjectLikes] = useState<{ [key: number]: number }>({});
  const courseOptions = useMemo(
    () =>
      Array.from(
        new Set(projects.map((project) => project.course).filter(Boolean)),
      ) as string[],
    [projects],
  );

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [projectsResponse, statsResponse] = await Promise.all([
        api.listProjects(),
        api.getStats(),
      ]);
      setProjects(projectsResponse);
      setStatsData(statsResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os projetos.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    setFeaturedProjects(getManualFeatured());
  }, [loadDashboardData]);

  useEffect(() => {
    const likes: { [key: number]: number } = {};
    projects.forEach((project) => {
      likes[project.id] = getLikesCount(project.id);
    });
    setProjectLikes(likes);
  }, [projects]);

  const handleToggleFeatured = (projectId: number) => {
    const isFeatured = toggleManualFeatured(projectId);
    if (isFeatured) {
      setFeaturedProjects([...featuredProjects, projectId]);
    } else {
      setFeaturedProjects(featuredProjects.filter(id => id !== projectId));
    }
  };

  const handleStatusChange = async (
    projectId: number,
    newStatus: ProjectStatus,
  ) => {
    const currentProject = projects.find((project) => project.id === projectId);
    if (!currentProject || currentProject.status === newStatus) {
      return;
    }

    try {
      setUpdatingProjectId(projectId);
      const updatedProject = await api.updateProjectStatus(projectId, newStatus);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? updatedProject : project,
        ),
      );
    } catch (updateError) {
      console.error("Erro ao atualizar status:", updateError);
    } finally {
      setUpdatingProjectId(null);
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    const variants: Record<ProjectStatus, { variant: "default" | "secondary" | "destructive" | "outline", icon: JSX.Element, color: string }> = {
      "Publicado": { 
        variant: "default", 
        icon: <CheckCircle2 className="h-3 w-3" />,
        color: "bg-green-100 text-green-800 border-green-300"
      },
      "Em Andamento": { 
        variant: "secondary", 
        icon: <Clock className="h-3 w-3" />,
        color: "bg-blue-100 text-blue-800 border-blue-300"
      },
      "Em Revisão": { 
        variant: "outline", 
        icon: <AlertCircle className="h-3 w-3" />,
        color: "bg-yellow-100 text-yellow-800 border-yellow-300"
      },
    };

    const config = variants[status];
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {status}
      </Badge>
    );
  };

  const filteredProjects = projects.filter((project) => {
    const searchable = [
      project.title,
      project.summary,
      project.description,
      project.author,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchable.includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    const matchesCourse =
      filterCourse === "all" || project.course === filterCourse;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const stats = {
    total: statsData?.summary.total ?? projects.length,
    publicado:
      statsData?.summary.published ??
      projects.filter((p) => p.status === "Publicado").length,
    emRevisao:
      statsData?.summary.inReview ??
      projects.filter((p) => p.status === "Em Revisão").length,
    emAndamento:
      statsData?.summary.inProgress ??
      projects.filter((p) => p.status === "Em Andamento").length,
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('isAdmin');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header da Dashboard */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                  <h1 className="text-xl font-bold">
                    <span className="text-primary">Proje</span>
                    <span className="text-secondary">plac</span>
                    <span className="text-muted-foreground ml-2">| Admin</span>
                  </h1>
                  <p className="text-sm text-muted-foreground">Dashboard de Administração</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-primary text-primary-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Administrador
              </Badge>
              <Button
                variant="outline"
                onClick={handleLogoutClick}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total de Projetos</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Todos os projetos cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Publicados</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.publicado}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Projetos aprovados e visíveis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Em Revisão</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.emRevisao}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Aguardando aprovação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.emAndamento}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, autor ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por Status */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Publicado">Publicado</SelectItem>
                  <SelectItem value="Em Revisão">Em Revisão</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por Curso */}
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Cursos</SelectItem>
                  {courseOptions.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Navegação */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="projects">Gerenciar Projetos</TabsTrigger>
            <TabsTrigger value="featured">Destaques</TabsTrigger>
          </TabsList>

          {/* Tab: Gerenciar Projetos */}
          <TabsContent value="projects" className="space-y-6">
            {/* Tabela de Projetos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Gerenciamento de Projetos</span>
                  <Badge variant="outline">{filteredProjects.length} projeto(s)</Badge>
                </CardTitle>
                <CardDescription>
                  Revise e altere o status dos projetos cadastrados na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground space-y-4">
                      <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                      Carregando projetos...
                    </div>
                  ) : error ? (
                    <div className="text-center py-12 space-y-4">
                      <p className="text-muted-foreground">{error}</p>
                      <Button variant="outline" onClick={loadDashboardData}>
                        Tentar novamente
                      </Button>
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhum projeto encontrado com os filtros aplicados
                      </p>
                    </div>
                  ) : (
                    filteredProjects.map((project) => (
                      <Card key={project.id} className="border border-border">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            {/* Informações do Projeto */}
                            <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">
                                {project.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                              {project.summary ?? project.description}
                              </p>
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {project.author ?? "Autor não informado"}
                                </span>
                                <span>•</span>
                                <span>{project.course ?? "Curso não informado"}</span>
                                <span>•</span>
                                <span>{formatDate(project.createdAt)}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {project.views} visualizações
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status e Ações */}
                        <div className="flex flex-col gap-3 md:items-end">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(project.status)}
                          </div>
                          
                          {/* Seletor de Status */}
                          <Select
                            value={project.status}
                            onValueChange={(value) =>
                              handleStatusChange(project.id, value as ProjectStatus)
                            }
                          >
                            <SelectTrigger
                              className="w-full md:w-48"
                              disabled={updatingProjectId === project.id}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Em Andamento">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  Em Andamento
                                </div>
                              </SelectItem>
                              <SelectItem value="Em Revisão">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                                  Em Revisão
                                </div>
                              </SelectItem>
                              <SelectItem value="Publicado">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  Publicado
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        {/* Tab: Destaques */}
        <TabsContent value="featured" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-secondary" />
                Gerenciar Projetos em Destaque
              </CardTitle>
              <CardDescription>
                Selecione manualmente os projetos que aparecerão na seção de destaques da página inicial. 
                Os projetos com mais curtidas também aparecem automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-sm">Destaques Automáticos por Curtidas</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Os projetos com mais curtidas aparecem automaticamente nos destaques quando não há destaques manuais suficientes.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Projetos Disponíveis (Ordenados por Curtidas)</h4>
                  {projects
                    .slice()
                    .sort((a, b) => (projectLikes[b.id] || 0) - (projectLikes[a.id] || 0))
                    .map((project) => {
                      const isFeatured = featuredProjects.includes(project.id);
                      const likes = projectLikes[project.id] || 0;
                      
                      return (
                        <Card 
                          key={project.id} 
                          className={`${isFeatured ? 'border-secondary border-2' : ''}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h4 className="font-semibold">{project.title}</h4>
                                  {isFeatured && (
                                    <Badge className="bg-secondary text-secondary-foreground">
                                      <Star className="h-3 w-3 mr-1" />
                                      Destaque
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                                  {project.summary ?? project.description}
                                </p>
                                <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground">
                                  <span>{project.author ?? "Autor não informado"}</span>
                                  <span>•</span>
                                  <span>{project.course ?? "Curso não informado"}</span>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Heart className={`h-3 w-3 ${likes > 0 ? 'text-destructive fill-current' : ''}`} />
                                    <span>{likes} {likes === 1 ? 'curtida' : 'curtidas'}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                variant={isFeatured ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleToggleFeatured(project.id)}
                                className={isFeatured 
                                  ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground shrink-0" 
                                  : "border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground shrink-0"
                                }
                              >
                                <Star className={`h-4 w-4 mr-2 ${isFeatured ? 'fill-current' : ''}`} />
                                {isFeatured ? 'Remover' : 'Destacar'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
