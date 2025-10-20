import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  ExternalLink,
  Heart,
  Users,
} from "lucide-react";

import { api, Project } from "../utils/api";
import {
  getCombinedFeatured,
  getLikesCount,
  getManualFeatured,
} from "../utils/likesManager";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface FeaturedProjectsProps {
  onNavigateToProjects?: () => void;
  onNavigateToProjectDetails?: (projectId: number) => void;
}

export function FeaturedProjects({
  onNavigateToProjects,
  onNavigateToProjectDetails,
}: FeaturedProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectLikes, setProjectLikes] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.listProjects({ sort: "popular" });
      setProjects(data);
      const manual = getManualFeatured();
      const ids = data.map((item) => item.id);
      const combined = getCombinedFeatured(6, ids);
      const orderedProjects = combined
        .map((id) => data.find((project) => project.id === id))
        .filter((project): project is Project => Boolean(project));

      const likes: Record<number, number> = {};
      orderedProjects.forEach((project) => {
        likes[project.id] = getLikesCount(project.id);
      });
      setProjectLikes(likes);
      setProjects(orderedProjects);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os projetos em destaque.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const featuredProjects = useMemo(() => projects.slice(0, 6), [projects]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Projetos em Destaque
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Os trabalhos mais relevantes publicados recentemente pelos alunos da
            UNICEPLAC. Conheça as iniciativas que estão gerando impacto na
            comunidade acadêmica.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center text-muted-foreground space-y-4 py-12">
            <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full" />
            Carregando destaques...
          </div>
        ) : error ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={loadProjects}>
              Tentar novamente
            </Button>
          </div>
        ) : featuredProjects.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            Nenhum projeto em destaque no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => {
              const coverImage = project.thumbnail ?? projeplacLogo;
              const likes = projectLikes[project.id] ?? 0;

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
                      <Badge className="bg-primary text-primary-foreground">
                        Destaque
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
                        {project.title}
                      </h3>
                      {likes > 0 && (
                        <div className="flex items-center gap-1 text-destructive">
                          <Heart className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">{likes}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.summary ?? project.description}
                    </p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {project.author ?? "Autor não informado"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {project.course ?? "Curso não informado"}
                      </div>
                    </div>

                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 4).map((tag) => (
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

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          onNavigateToProjectDetails?.(project.id)
                        }
                      >
                        Ver detalhes
                      </Button>
                      <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => onNavigateToProjectDetails?.(project.id)}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Abrir projeto
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={onNavigateToProjects}
            className="text-primary hover:text-primary/80"
          >
            Ver todos os projetos
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
