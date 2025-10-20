import { useCallback, useEffect, useMemo, useState } from "react";
import { Code, Computer, Database, Network } from "lucide-react";

import { api, Project } from "../utils/api";

import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface CategoriesProps {
  onNavigateToProjects?: (category?: string) => void;
}

const CATEGORY_LIBRARY: Record<
  string,
  { icon: typeof Code; color: string; description: string }
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

export function Categories({ onNavigateToProjects }: CategoriesProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.listProjects();
      setProjects(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as categorias.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const categorySummaries = useMemo(() => {
    const counts = projects.reduce<Map<string, number>>((acc, project) => {
      if (!project.course) return acc;
      acc.set(project.course, (acc.get(project.course) ?? 0) + 1);
      return acc;
    }, new Map());

    return Array.from(counts.entries())
      .map(([name, count], index) => {
        const libraryItem =
          CATEGORY_LIBRARY[name] ??
          Object.values(CATEGORY_LIBRARY)[index % Object.values(CATEGORY_LIBRARY).length] ??
          {
            icon: Code,
            color: "bg-primary",
            description: "Projetos acadêmicos cadastrados na plataforma.",
          };

        return {
          id: name,
          name,
          count,
          icon: libraryItem.icon,
          color: libraryItem.color,
          description: libraryItem.description,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [projects]);

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Explore projetos por Curso
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra projetos organizados por área de conhecimento e encontre
            referências para o seu próximo trabalho.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center text-muted-foreground space-y-4 py-12">
            <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full" />
            Carregando categorias...
          </div>
        ) : error ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={loadProjects}>
              Tentar novamente
            </Button>
          </div>
        ) : categorySummaries.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            Ainda não há cursos cadastrados com projetos publicados.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categorySummaries.slice(0, 8).map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                  onClick={() => onNavigateToProjects?.(category.name)}
                >
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div
                        className={`p-3 ${category.color} rounded-full text-white group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {category.count} projeto{category.count === 1 ? "" : "s"}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      Explorar
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Button variant="outline" size="lg" onClick={() => onNavigateToProjects?.()}>
            Ver Todas as Categorias
          </Button>
        </div>
      </div>
    </section>
  );
}
