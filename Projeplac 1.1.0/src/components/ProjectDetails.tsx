import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Building,
  Calendar,
  Clock,
  ExternalLink,
  Github,
  Globe,
  GraduationCap,
  Heart,
  Users,
  User,
  Youtube,
} from "lucide-react";

import { api, Project, ProjectStatus } from "../utils/api";
import { getLikesCount, hasUserLiked, toggleLike } from "../utils/likesManager";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

interface ProjectDetailsProps {
  onBack: () => void;
  projectId: number;
}

const STATUS_BADGE_CLASS: Record<ProjectStatus, string> = {
  Publicado: "bg-green-500 text-white",
  "Em Andamento": "bg-secondary text-secondary-foreground",
  "Em Revisão": "bg-yellow-200 text-yellow-800",
};

const formatDate = (value?: string | null) => {
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

export function ProjectDetails({ onBack, projectId }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(() => getLikesCount(projectId));
  const [isLiked, setIsLiked] = useState(() => hasUserLiked(projectId));

  useEffect(() => {
    setLikesCount(getLikesCount(projectId));
    setIsLiked(hasUserLiked(projectId));
  }, [projectId]);

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getProject(projectId);
        if (isMounted) {
          setProject(data);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os detalhes do projeto.",
        );
        setProject(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const handleLike = () => {
    const result = toggleLike(projectId);
    setIsLiked(result.liked);
    setLikesCount(result.count);
  };

  const descriptionParagraphs = useMemo(() => {
    if (!project) return [];
    const text =
      project.description ??
      project.summary ??
      "Este projeto ainda não possui uma descrição detalhada.";
    return text
      .split("\n")
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [project]);

  const badgeClass =
    project && STATUS_BADGE_CLASS[project.status]
      ? STATUS_BADGE_CLASS[project.status]
      : "bg-muted text-muted-foreground";

  if (isLoading && !project) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center text-muted-foreground space-y-4">
            <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full" />
            Carregando projeto...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Ocorreu um erro</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => location.reload()}>Tentar novamente</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Projeto não encontrado
          </h2>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const heroImage = project.thumbnail ?? projeplacLogo;
  const members = project.members ?? [];
  const hasLinks =
    project.projectUrl || project.youtubeUrl || project.githubUrl;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-3 flex-wrap">
              <Badge variant="secondary" className={badgeClass}>
                {project.status}
              </Badge>
              {project.category && (
                <Badge variant="outline" className="text-primary border-primary">
                  {project.category}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {project.summary ?? project.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                className={
                  isLiked
                    ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0"
                    : "border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                }
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                />
                {likesCount} {likesCount === 1 ? "Curtida" : "Curtidas"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => project.projectUrl && window.open(project.projectUrl, "_blank")}
              disabled={!project.projectUrl}
            >
              <Globe className="h-4 w-4 mr-2" />
              Ver Projeto
            </Button>
            <Button
              variant="outline"
              onClick={() => project.youtubeUrl && window.open(project.youtubeUrl, "_blank")}
              disabled={!project.youtubeUrl}
            >
              <Youtube className="h-4 w-4 mr-2 text-red-600" />
              Assistir Demo
            </Button>
            <Button
              variant="outline"
              onClick={() => project.githubUrl && window.open(project.githubUrl, "_blank")}
              disabled={!project.githubUrl}
            >
              <Github className="h-4 w-4 mr-2" />
              Código Fonte
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden">
              <img
                src={heroImage}
                alt={project.title}
                className="w-full h-64 object-cover"
              />
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-semibold flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Sobre o Projeto
              </h3>
              <div className="space-y-3 text-muted-foreground">
                {descriptionParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Card>

            {project.tags.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Tecnologias Utilizadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={`${project.id}-${tag}`} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {members.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Equipe do Projeto</h3>
                <div className="space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex flex-wrap items-center justify-between gap-2"
                    >
                      <div className="font-medium text-foreground">
                        {member.name}
                      </div>
                      {member.role && (
                        <Badge variant="secondary">{member.role}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Informações do Projeto
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Data de Cadastro</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                </div>

                <Separator />

                {project.course && (
                  <>
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Curso</p>
                        <p className="text-sm text-muted-foreground">
                          {project.course}
                        </p>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {project.semester && (
                  <>
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Semestre</p>
                        <p className="text-sm text-muted-foreground">
                          {project.semester}
                        </p>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {project.shift && (
                  <>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Turno</p>
                        <p className="text-sm text-muted-foreground">
                          {project.shift}
                        </p>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {project.class && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Turma</p>
                      <p className="text-sm text-muted-foreground">
                        {project.class}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Autor do Projeto</h3>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">
                    {project.author ?? "Autor não informado"}
                  </p>
                  {project.authorEmail && (
                    <a
                      href={`mailto:${project.authorEmail}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {project.authorEmail}
                    </a>
                  )}
                </div>
              </div>
            </Card>

            {project.professor && (
              <Card className="p-6 space-y-3">
                <h3 className="text-lg font-semibold">Professor Orientador</h3>
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{project.professor}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.course ?? ""}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {hasLinks && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Links do Projeto</h3>
                <div className="space-y-3">
                  {project.projectUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(project.projectUrl!, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Projeto Online
                    </Button>
                  )}
                  {project.youtubeUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(project.youtubeUrl!, "_blank")}
                    >
                      <Youtube className="h-4 w-4 mr-2 text-red-600" />
                      Demo no YouTube
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(project.githubUrl!, "_blank")}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Código no GitHub
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
