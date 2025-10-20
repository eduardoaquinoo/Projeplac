import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Filter,
  Search,
  Users,
} from "lucide-react";

import { api, Project, ProjectStatus } from "../utils/api";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ProfileIcon } from "./ProfileIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SearchResultsProps {
  onBack: () => void;
  onNavigateToProjectDetails: (projectId: number) => void;
  initialSearchTerm?: string;
}

const STATUS_OPTIONS: ProjectStatus[] = ["Publicado", "Em Revisão", "Em Andamento"];

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

export function SearchResults({
  onBack,
  onNavigateToProjectDetails,
  initialSearchTerm = "",
}: SearchResultsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedStatus, setSelectedStatus] = useState<"all" | ProjectStatus>("all");
  const [selectedCourse, setSelectedCourse] = useState("all");

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

  const courseOptions = useMemo(
    () =>
      Array.from(
        new Set(projects.map((project) => project.course).filter(Boolean)),
      ) as string[],
    [projects],
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchable = [
        project.title,
        project.summary,
        project.description,
        project.author,
        project.professor,
        project.tags.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchable.includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || project.status === selectedStatus;
      const matchesCourse =
        selectedCourse === "all" || project.course === selectedCourse;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [projects, searchTerm, selectedStatus, selectedCourse]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button
                variant="ghost"
                className="px-0 text-primary hover:text-primary/80"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <span>Resultados da busca</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Buscar Projetos
            </h1>
            <p className="text-sm text-muted-foreground">
              Pesquise por título, descrição, curso, professor ou tags.
            </p>
          </div>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b border-border/60">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite um termo de busca..."
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as "all" | ProjectStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cursos</SelectItem>
                {courseOptions.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{filteredProjects.length} projeto(s) encontrado(s)</span>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80"
                onClick={() => {
                  setSelectedStatus("all");
                  setSelectedCourse("all");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            </div>

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
                Nenhum projeto corresponde aos filtros selecionados.
              </div>
            ) : (
              filteredProjects.map((project) => {
                const coverImage = project.thumbnail ?? projeplacLogo;
                return (
                  <Card
                    key={project.id}
                    className="border border-border hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row gap-6 p-6">
                      <div className="w-full lg:w-56 h-40 rounded-lg overflow-hidden border border-border">
                        <img
                          src={coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline">{project.status}</Badge>
                          {project.course && (
                            <Badge variant="secondary">{project.course}</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Atualizado em {formatDate(project.updatedAt)}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-foreground">
                          {project.title}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {project.summary ?? project.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ProfileIcon type="aluno" size="xs" />
                            {project.author ?? "Autor não informado"}
                          </span>
                          {project.professor && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <ProfileIcon type="professor" size="xs" />
                                {project.professor}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(project.createdAt)}
                          </span>
                        </div>

                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 6).map((tag) => (
                              <Badge key={`${project.id}-${tag}`} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 w-full lg:w-40">
                        <Button
                          variant="outline"
                          onClick={() => onNavigateToProjectDetails(project.id)}
                        >
                          Ver detalhes
                        </Button>
                        {project.projectUrl && (
                          <Button
                            variant="ghost"
                            onClick={() => window.open(project.projectUrl!, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Acessar projeto
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
