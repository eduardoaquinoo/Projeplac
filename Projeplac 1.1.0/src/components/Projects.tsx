import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";
import { api, Project, ProjectStatus, StatsResponse } from "../utils/api";

interface ProjectsProps {
  onBack: () => void;
  onNavigateToProjectDetails?: (projectId: number) => void;
}

const CATEGORY_LIBRARY: Record<
  string,
  {
    icon: typeof Code;
    color: string;
    description: string;
  }
> = {
  "Engenharia de Software": {
    icon: Code,
    color: "bg-primary",
    description: "Desenvolvimento, Arquitetura, Metodologias Ágeis",
  },
  "Análise e Desenvolvimento de Sistemas": {
    icon: Database,
    color: "bg-secondary",
    description: "Análise de Requisitos, Modelagem, Desenvolvimento",
  },
  "Ciência da Computação": {
    icon: Computer,
    color: "bg-primary",
    description: "Algoritmos, Estruturas de Dados, Inteligência Artificial",
  },
  "Sistemas de Informação": {
    icon: Network,
    color: "bg-secondary",
    description: "Gestão de TI, Business Intelligence, ERP",
  },
};

const STATUS_OPTIONS: ProjectStatus[] = [
  "Em Andamento",
  "Publicado",
  "Em Revisão",
];

const STATUS_BADGE_CLASS: Record<ProjectStatus, string> = {
  Publicado: "bg-green-500 text-white",
  "Em Andamento": "bg-secondary text-secondary-foreground",
  "Em Revisão": "bg-yellow-200 text-yellow-800",
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "Data não informada";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
};

export function Projects({ onBack, onNavigateToProjectDetails }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedProfessor, setSelectedProfessor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 12;
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.listProjects({ sort: "newest" });
      setProjects(data);
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

  const loadStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      setStatsError(null);
      const response = await api.getStats();
      setStats(response);
    } catch (err) {
      setStatsError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as estatísticas.",
      );
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
    loadStats();
  }, [loadProjects, loadStats]);

  const categorySummaries = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((project) => {
      if (!project.category) return;
      counts.set(project.category, (counts.get(project.category) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([name, count], index) => {
        const libraryItem = CATEGORY_LIBRARY[name] ?? {
          icon: Code,
          color: index % 2 === 0 ? "bg-primary" : "bg-secondary",
          description: "Projetos acadêmicos cadastrados na plataforma.",
        };
        return {
          id: index + 1,
          name,
          icon: libraryItem.icon,
          count,
          color: libraryItem.color,
          description: libraryItem.description,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [projects]);

  const coursesBreakdown = useMemo(() => {
    if (stats?.byCourse?.length) {
      return stats.byCourse.map((course) => ({
        course: course.course,
        total: course.total,
      }));
    }

    return categorySummaries.map((category) => ({
      course: category.name,
      total: category.count,
    }));
  }, [stats, categorySummaries]);

  const latestProjects = useMemo(() => {
    if (stats?.latestProjects?.length) {
      return stats.latestProjects.map((project) => ({
        id: project.id,
        title: project.title,
        author: project.author,
        status: project.status,
        createdAt: new Date(project.created_at).toISOString(),
      }));
    }

    return projects
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5)
      .map((project) => ({
        id: project.id,
        title: project.title,
        author: project.author ?? "Autor não informado",
        status: project.status,
        createdAt: project.createdAt,
      }));
  }, [stats, projects]);

  const featuredProjects = useMemo(() => {
    return projects
      .slice()
      .filter((project) => project.status === "Publicado")
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
  }, [projects]);

  const courseOptions = useMemo(() => {
    return (
      Array.from(
        new Set(projects.map((project) => project.course).filter(Boolean)),
      ) as string[]
    ).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const classOptions = useMemo(() => {
    return (
      Array.from(
        new Set(projects.map((project) => project.class).filter(Boolean)),
      ) as string[]
    ).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const professorOptions = useMemo(() => {
    return (
      Array.from(
        new Set(
          projects.map((project) => project.professor).filter(Boolean),
        ),
      ) as string[]
    ).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const semesterOptions = useMemo(() => {
    return (
      Array.from(
        new Set(projects.map((project) => project.semester).filter(Boolean)),
      ) as string[]
    ).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const shiftOptions = useMemo(() => {
    return (
      Array.from(
        new Set(projects.map((project) => project.shift).filter(Boolean)),
      ) as string[]
    ).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const statusOptions = useMemo(() => {
    const fromData = new Set<ProjectStatus>();
    STATUS_OPTIONS.forEach((status) => fromData.add(status));
    projects.forEach((project) => {
      if (project.status) {
        fromData.add(project.status);
      }
    });
    return Array.from(fromData);
  }, [projects]);

  const shiftCounts = useMemo(
    () =>
      Array.from(
        projects.reduce((map, project) => {
          if (!project.shift) return map;
          const total = map.get(project.shift) ?? 0;
          map.set(project.shift, total + 1);
          return map;
        }, new Map<string, number>()),
      ).map(([shift, total]) => ({ shift, total })),
    [projects],
  );

  const totalProjects = stats?.summary.total ?? projects.length;
  const publishedProjects =
    stats?.summary.published ??
    projects.filter((project) => project.status === "Publicado").length;
  const inProgressProjects =
    stats?.summary.inProgress ??
    projects.filter((project) => project.status === "Em Andamento").length;
  const inReviewProjects =
    stats?.summary.inReview ??
    projects.filter((project) => project.status === "Em Revisão").length;
  const professorsCount = professorOptions.length;

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchableText = [
        project.title,
        project.summary,
        project.description,
        project.author,
        project.professor,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        searchTerm.toLowerCase(),
      );

      const matchesCourse =
        selectedCourse === "all" ||
        (project.course ?? "") === selectedCourse;

      const matchesClass =
        selectedClass === "all" ||
        (project.class ?? "") === selectedClass;

      const matchesShift =
        selectedShift === "all" ||
        (project.shift ?? "") === selectedShift;

      const matchesSemester =
        selectedSemester === "all" ||
        (project.semester ?? "") === selectedSemester;

      const matchesProfessor =
        selectedProfessor === "all" ||
        (project.professor ?? "") === selectedProfessor;

      const matchesStatus =
        selectedStatus === "all" || project.status === selectedStatus;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesClass &&
        matchesShift &&
        matchesSemester &&
        matchesProfessor &&
        matchesStatus
      );
    });
  }, [
    projects,
    searchTerm,
    selectedCourse,
    selectedClass,
    selectedShift,
    selectedSemester,
    selectedProfessor,
    selectedStatus,
  ]);

  // Paginação
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);
  const fromIndex = filteredProjects.length === 0 ? 0 : startIndex + 1;
  const toIndex =
    filteredProjects.length === 0
      ? 0
      : Math.min(endIndex, filteredProjects.length);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCourse("all");
    setSelectedClass("all");
    setSelectedShift("all");
    setSelectedSemester("all");
    setSelectedProfessor("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  // Reset para página 1 quando os filtros mudarem
  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
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
                  <Select value={selectedCourse} onValueChange={(value) => handleFilterChange(setSelectedCourse, value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por Curso" />
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

                  <Select value={selectedStatus} onValueChange={(value) => handleFilterChange(setSelectedStatus, value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
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
                  Mostrando {fromIndex}-{toIndex} de {filteredProjects.length} projetos
                </span>
                <span>
                  Página {currentPage} de {totalPages || 1}
                </span>
              </div>
            </div>

            {/* Lista de Projetos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {isLoading && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full mb-4" />
                  Carregando projetos...
                </div>
              )}

              {!isLoading && error && (
                <div className="col-span-full text-center py-12 space-y-4">
                  <p className="text-muted-foreground">
                    {error}
                  </p>
                  <Button variant="outline" onClick={loadProjects}>
                    Tentar novamente
                  </Button>
                </div>
              )}

              {!isLoading && !error && currentProjects.length === 0 && (
                <div className="col-span-full text-center py-12 space-y-4">
                  <p className="text-muted-foreground">
                    Nenhum projeto encontrado com os filtros aplicados.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                </div>
              )}

              {!isLoading &&
                !error &&
                currentProjects.map((project) => {
                  const badgeClass =
                    STATUS_BADGE_CLASS[project.status] ??
                    "bg-muted text-muted-foreground";
                  const coverImage = project.thumbnail ?? projeplacLogo;
                  const summary =
                    project.summary ??
                    project.description ??
                    "Este projeto ainda não possui descrição detalhada.";

                  const details = [
                    project.professor,
                    project.semester,
                    project.shift,
                    project.course,
                  ]
                    .filter(Boolean)
                    .join(" • ");

                  return (
                    <Card
                      key={project.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className={badgeClass}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white/90 hover:bg-white"
                            onClick={() =>
                              onNavigateToProjectDetails?.(project.id)
                            }
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
                            {project.title}
                          </h3>
                          {project.views > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {project.views} visualizações
                            </Badge>
                          )}
                        </div>

                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {summary}
                        </p>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {project.author ?? "Autor não informado"}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(project.createdAt)}
                            {project.class ? ` • ${project.class}` : ""}
                          </div>
                          {details && <div>{details}</div>}
                        </div>

                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {project.projectUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Projeto
                              </a>
                            </Button>
                          )}
                          {project.youtubeUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={project.youtubeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2"
                              >
                                <Youtube className="h-4 w-4" />
                                Vídeo
                              </a>
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2"
                              >
                                <Github className="h-4 w-4" />
                                GitHub
                              </a>
                            </Button>
                          )}
                        </div>

                        <Button
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() =>
                            onNavigateToProjectDetails?.(project.id)
                          }
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </Card>
                  );
                })}
            </div>

            {/* Paginação */}
            {filteredProjects.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Mostrar primeira página, última página, página atual e páginas adjacentes
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
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
                {categorySummaries.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card 
                      key={category.name} 
                      className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                      onClick={() => handleFilterChange(setSelectedCourse, category.name)}
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
                  <Select value={selectedCourse} onValueChange={(value) => handleFilterChange(setSelectedCourse, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o curso" />
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

                <div>
                  <Label htmlFor="class-filter">Turma</Label>
                  <Select value={selectedClass} onValueChange={(value) => handleFilterChange(setSelectedClass, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Turmas</SelectItem>
                      {classOptions.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="shift-filter">Turno</Label>
                  <Select value={selectedShift} onValueChange={(value) => handleFilterChange(setSelectedShift, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Turnos</SelectItem>
                      {shiftOptions.map((shift) => (
                        <SelectItem key={shift} value={shift}>
                          {shift}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="semester-filter">Semestre</Label>
                  <Select value={selectedSemester} onValueChange={(value) => handleFilterChange(setSelectedSemester, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Semestres</SelectItem>
                      {semesterOptions.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="professor-filter">Professor</Label>
                  <Select value={selectedProfessor} onValueChange={(value) => handleFilterChange(setSelectedProfessor, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o professor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Professores</SelectItem>
                      {professorOptions.map((professor) => (
                        <SelectItem key={professor} value={professor}>
                          {professor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={selectedStatus} onValueChange={(value) => handleFilterChange(setSelectedStatus, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {isLoading && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full mb-4" />
                  Carregando projetos...
                </div>
              )}

              {!isLoading && error && (
                <div className="col-span-full text-center py-12 space-y-4">
                  <p className="text-muted-foreground">
                    {error}
                  </p>
                  <Button variant="outline" onClick={loadProjects}>
                    Tentar novamente
                  </Button>
                </div>
              )}

              {!isLoading && !error && currentProjects.length === 0 && (
                <div className="col-span-full text-center py-12 space-y-4">
                  <p className="text-muted-foreground">
                    Nenhum projeto encontrado com os filtros aplicados.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                </div>
              )}

              {!isLoading &&
                !error &&
                currentProjects.map((project) => {
                  const badgeClass =
                    STATUS_BADGE_CLASS[project.status] ??
                    "bg-muted text-muted-foreground";
                  const coverImage = project.thumbnail ?? projeplacLogo;
                  const summary =
                    project.summary ??
                    project.description ??
                    "Este projeto ainda não possui descrição detalhada.";

                  const details = [
                    project.professor,
                    project.semester,
                    project.shift,
                    project.course,
                  ]
                    .filter(Boolean)
                    .join(" • ");

                  return (
                    <Card
                      key={project.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className={badgeClass}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white/90 hover:bg-white"
                            onClick={() =>
                              onNavigateToProjectDetails?.(project.id)
                            }
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
                            {project.title}
                          </h3>
                          {project.views > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {project.views} visualizações
                            </Badge>
                          )}
                        </div>

                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {summary}
                        </p>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {project.author ?? "Autor não informado"}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(project.createdAt)}
                            {project.class ? ` • ${project.class}` : ""}
                          </div>
                          {details && <div>{details}</div>}
                        </div>

                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {project.projectUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Projeto
                              </a>
                            </Button>
                          )}
                          {project.youtubeUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={project.youtubeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2"
                              >
                                <Youtube className="h-4 w-4" />
                                Vídeo
                              </a>
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2"
                              >
                                <Github className="h-4 w-4" />
                                GitHub
                              </a>
                            </Button>
                          )}
                        </div>

                        <Button
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() =>
                            onNavigateToProjectDetails?.(project.id)
                          }
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </Card>
                  );
                })}
            </div>

            {/* Paginação para Filtros Avançados */}
            {filteredProjects.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            {/* Estatísticas */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-foreground text-center">
                Estatísticas dos Projetos
              </h3>

              {isLoadingStats ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full mb-4" />
                  Carregando estatísticas...
                </div>
              ) : statsError ? (
                <div className="text-center py-12 space-y-4">
                  <p className="text-muted-foreground">{statsError}</p>
                  <Button variant="outline" onClick={loadStats}>
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 text-center">
                      <h4 className="text-2xl font-bold text-primary mb-2">
                        {totalProjects}
                      </h4>
                      <p className="text-muted-foreground">Total de Projetos</p>
                    </Card>

                    <Card className="p-6 text-center">
                      <h4 className="text-2xl font-bold text-secondary mb-2">
                        {publishedProjects}
                      </h4>
                      <p className="text-muted-foreground">Projetos Publicados</p>
                    </Card>

                    <Card className="p-6 text-center">
                      <h4 className="text-2xl font-bold text-primary mb-2">
                        {inProgressProjects}
                      </h4>
                      <p className="text-muted-foreground">Em Andamento</p>
                    </Card>

                    <Card className="p-6 text-center">
                      <h4 className="text-2xl font-bold text-secondary mb-2">
                        {inReviewProjects}
                      </h4>
                      <p className="text-muted-foreground">Em Revisão</p>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="p-6 text-center">
                      <h4 className="text-lg font-semibold mb-2">
                        Professores Orientadores
                      </h4>
                      <p className="text-3xl font-bold text-primary">
                        {professorsCount}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Total de professores envolvidos
                      </p>
                    </Card>

                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">
                        Projetos por Curso
                      </h4>
                      <div className="space-y-3">
                        {coursesBreakdown.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            Nenhum curso cadastrado até o momento.
                          </p>
                        )}
                        {coursesBreakdown.map(({ course, total }) => (
                          <div
                            key={course}
                            className="flex justify-between items-center"
                          >
                            <span className="text-muted-foreground">
                              {course}
                            </span>
                            <Badge variant="outline">{total} projetos</Badge>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">
                        Projetos por Turno
                      </h4>
                      <div className="space-y-3">
                        {shiftCounts.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            Nenhum turno registrado até o momento.
                          </p>
                        )}
                        {shiftCounts.map(({ shift, total }) => (
                          <div
                            key={shift}
                            className="flex justify-between items-center"
                          >
                            <span className="text-muted-foreground">{shift}</span>
                            <Badge variant="outline">{total} projetos</Badge>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <Card className="p-6">
                    <h4 className="text-lg font-semibold mb-4">
                      Novos projetos cadastrados
                    </h4>
                    <div className="space-y-3">
                      {latestProjects.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Nenhum projeto cadastrado recentemente.
                        </p>
                      )}
                      {latestProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {project.title}
                            </p>
                            <p>{project.author ?? "Autor não informado"}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant="outline">{project.status}</Badge>
                            <p className="text-xs">
                              {formatDate(project.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="featured">
            {/* Projetos em Destaque */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-foreground text-center">
                Projetos em Destaque
              </h3>
              
              {featuredProjects.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  Nenhum projeto publicado disponível ainda.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProjects.map((project) => {
                    const coverImage = project.thumbnail ?? projeplacLogo;
                    const summary =
                      project.summary ??
                      project.description ??
                      "Projeto publicado sem descrição detalhada.";

                    return (
                      <Card
                        key={project.id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20"
                      >
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-primary text-primary-foreground flex items-center gap-2">
                              ⭐ Destaque
                            </Badge>
                          </div>
                        </div>

                        <div className="p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                                {project.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                Publicado em {formatDate(project.createdAt)}
                              </p>
                            </div>
                            <div className="flex space-x-1">
                              {project.projectUrl && (
                                <Button variant="ghost" size="sm" asChild title="Ver Projeto">
                                  <a
                                    href={project.projectUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                              {project.youtubeUrl && (
                                <Button variant="ghost" size="sm" asChild title="Vídeo">
                                  <a
                                    href={project.youtubeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center text-red-600"
                                  >
                                    <Youtube className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                              {project.githubUrl && (
                                <Button variant="ghost" size="sm" asChild title="Repositório">
                                  <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center"
                                  >
                                    <Github className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm line-clamp-3">
                            {summary}
                          </p>

                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {project.author ?? "Autor não informado"}
                            </div>
                            {project.course && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {project.course}
                              </div>
                            )}
                          </div>

                          {project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {project.tags.map((tag) => (
                                <Badge
                                  key={`${project.id}-${tag}`}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <Button
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() =>
                              onNavigateToProjectDetails?.(project.id)
                            }
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
