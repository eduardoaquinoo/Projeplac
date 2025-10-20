import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Edit,
  ExternalLink,
  Filter,
  Github,
  Plus,
  Search,
  Trash2,
  Users,
  Youtube,
} from "lucide-react";

import { api, Project, ProjectStatus } from "../utils/api";
import { getLikesCount } from "../utils/likesManager";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface MyProjectsProps {
  onBack: () => void;
  onNavigateToProjectDetails?: (projectId: number) => void;
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  Publicado: "Publicado",
  "Em Andamento": "Em Andamento",
  "Em Revisão": "Em Revisão",
};

const formatDate = (value?: string | null) => {
  if (!value) return "Data não informada";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export function MyProjects({
  onBack,
  onNavigateToProjectDetails,
}: MyProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | ProjectStatus>("all");

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.listProjects();
      setProjects(response);
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
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    const likesMap: Record<number, number> = {};
    projects.forEach((project) => {
      likesMap[project.id] = getLikesCount(project.id);
    });
    setLikes(likesMap);
  }, [projects]);

  const currentAuthor =
    localStorage.getItem("projeplac_current_author")?.trim() ?? "";

  const myProjects = useMemo(() => {
    if (!currentAuthor) {
      return projects;
    }

    const authorLower = currentAuthor.toLowerCase();
    return projects.filter((project) => {
      const matchesAuthor =
        project.author?.toLowerCase() === authorLower ||
        project.members.some(
          (member) => member.name?.toLowerCase() === authorLower,
        );
      return matchesAuthor;
    });
  }, [projects, currentAuthor]);

  const filteredProjects = useMemo(() => {
    return myProjects.filter((project) => {
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
        selectedStatus === "all" || project.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [myProjects, searchTerm, selectedStatus]);

  const stats = useMemo(() => {
    const total = myProjects.length;
    const published = myProjects.filter(
      (project) => project.status === "Publicado",
    ).length;
    const inProgress = myProjects.filter(
      (project) => project.status === "Em Andamento",
    ).length;
    const inReview = myProjects.filter(
      (project) => project.status === "Em Revisão",
    ).length;
    const totalViews = myProjects.reduce(
      (acc, project) => acc + (project.views ?? 0),
      0,
    );
    const totalLikes = myProjects.reduce(
      (acc, project) => acc + (likes[project.id] ?? 0),
      0,
    );

    return {
      total,
      published,
      inProgress,
      inReview,
      totalViews,
      totalLikes,
    };
  }, [myProjects, likes]);

  const handleDeleteProject = (projectId: number) => {
    console.log("Solicitação de exclusão do projeto:", projectId);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Meus Projetos
            </h1>
            <p className="text-muted-foreground">
              {currentAuthor
                ? `Projetos associados a ${currentAuthor}.`
                : "Projets cadastrados por você ou nos quais você participa."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-secondary text-secondary hover:bg-secondary hover:text-white"
            >
              Voltar
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-96">
            <TabsTrigger value="projects">Meus Projetos</TabsTrigger>
            <TabsTrigger value="analytics">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-border/60">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por título ou autor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(value as "all" | ProjectStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setSelectedStatus("all")}>
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar filtros
                </Button>
              </div>

              <div className="space-y-4 p-6">
                {isLoading ? (
                  <div className="text-center text-muted-foreground py-12 space-y-4">
                    <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                    Carregando projetos...
                  </div>
                ) : error ? (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-muted-foreground">{error}</p>
                    <Button variant="outline" onClick={loadProjects}>
                      Tentar novamente
                    </Button>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    Nenhum projeto encontrado.
                  </div>
                ) : (
                  filteredProjects.map((project) => {
                    const projectLikes = likes[project.id] ?? 0;
                    return (
                      <Card
                        key={project.id}
                        className="border border-border hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row gap-6 p-6">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">
                                {STATUS_LABELS[project.status]}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(project.createdAt)}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {project.summary ?? project.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {project.author ?? "Autor não informado"}
                              </span>
                              {project.course && (
                                <>
                                  <span>•</span>
                                  <span>{project.course}</span>
                                </>
                              )}
                              <span>•</span>
                              <span>{project.views ?? 0} visualizações</span>
                              <span>•</span>
                              <span>{projectLikes} curtidas</span>
                            </div>
                            {project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {project.tags.slice(0, 5).map((tag) => (
                                  <Badge key={`${project.id}-${tag}`} variant="outline">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 w-full lg:w-48">
                            <Button
                              variant="outline"
                              onClick={() =>
                                onNavigateToProjectDetails?.(project.id)
                              }
                            >
                              Ver detalhes
                            </Button>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Confirmar exclusão
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza de que deseja remover este projeto?
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteProject(project.id)}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            <div className="flex flex-col gap-2">
                              {project.projectUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    window.open(project.projectUrl!, "_blank")
                                  }
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Projeto
                                </Button>
                              )}
                              {project.youtubeUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    window.open(project.youtubeUrl!, "_blank")
                                  }
                                >
                                  <Youtube className="h-4 w-4 mr-2 text-red-600" />
                                  Vídeo
                                </Button>
                              )}
                              {project.githubUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    window.open(project.githubUrl!, "_blank")
                                  }
                                >
                                  <Github className="h-4 w-4 mr-2" />
                                  GitHub
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <h4 className="text-3xl font-bold text-primary mb-2">
                  {stats.total}
                </h4>
                <p className="text-muted-foreground">Projetos cadastrados</p>
              </Card>
              <Card className="p-6 text-center">
                <h4 className="text-3xl font-bold text-secondary mb-2">
                  {stats.published}
                </h4>
                <p className="text-muted-foreground">Publicados</p>
              </Card>
              <Card className="p-6 text-center">
                <h4 className="text-3xl font-bold text-primary mb-2">
                  {stats.inProgress}
                </h4>
                <p className="text-muted-foreground">Em andamento</p>
              </Card>
              <Card className="p-6 text-center">
                <h4 className="text-3xl font-bold text-secondary mb-2">
                  {stats.inReview}
                </h4>
                <p className="text-muted-foreground">Em revisão</p>
              </Card>
              <Card className="p-6 text-center">
                <h4 className="text-3xl font-bold text-primary mb-2">
                  {stats.totalViews}
                </h4>
                <p className="text-muted-foreground">Visualizações totais</p>
              </Card>
              <Card className="p-6 text-center">
                <h4 className="text-3xl font-bold text-secondary mb-2">
                  {stats.totalLikes}
                </h4>
                <p className="text-muted-foreground">Curtidas acumuladas</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
