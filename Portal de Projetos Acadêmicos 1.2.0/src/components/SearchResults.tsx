import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ProfileIcon } from "./ProfileIcon";
import { ArrowLeft, Search, Filter, X, ExternalLink, Calendar, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";
import { getPublishedProjects, deleteProject, type Project } from "../utils/projectsManager";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface SearchResultsProps {
  onBack: () => void;
  onNavigateToProjectDetails: (projectId: number) => void;
  initialSearchTerm?: string;
  isAdmin?: boolean;
}

export function SearchResults({ onBack, onNavigateToProjectDetails, initialSearchTerm = "", isAdmin = false }: SearchResultsProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  // Carregar projetos do localStorage
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const publishedProjects = getPublishedProjects();
    setProjects(publishedProjects);
  };

  // Extrair todas as tags únicas dos projetos, incluindo professores
  const allTags = Array.from(new Set([
    ...projects.flatMap(p => p.tags),
    ...projects.filter(p => p.professorName).map(p => p.professorName!)
  ])).sort();

  // Filtrar projetos quando searchTerm, selectedTags ou projects mudam
  useEffect(() => {
    filterProjects();
  }, [searchTerm, selectedTags, projects]);

  const filterProjects = () => {
    let results = projects;

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.summary.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.authorName.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        project.course?.toLowerCase().includes(searchLower) ||
        project.professorName?.toLowerCase().includes(searchLower) ||
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
            return project.professorName === tag;
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

  const handleDeleteProject = (projectId: number) => {
    if (deleteProject(projectId)) {
      loadProjects();
      setProjectToDelete(null);
      alert("Projeto excluído com sucesso!");
    } else {
      alert("Erro ao excluir projeto.");
    }
  };

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
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
              {allTags.filter(tag => tag.startsWith("Prof.")).length > 0 && (
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
              )}

              {/* Tags de Tecnologia */}
              {allTags.filter(tag => !tag.startsWith("Prof.")).length > 0 && (
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
              )}
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
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative"
              >
                {/* Botão Excluir - Apenas Admin */}
                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProjectToDelete(project.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                <div onClick={() => onNavigateToProjectDetails(project.id)}>
                  {/* Imagem do Projeto */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {project.thumbnailImage ? (
                      <img
                        src={project.thumbnailImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <span className="text-4xl font-bold text-primary/40">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-primary text-primary-foreground"
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
                      {project.summary}
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
                      {project.professorName && (
                        <div className="flex items-center gap-2">
                          <ProfileIcon type="professor" size="sm" />
                          <span className="line-clamp-1">{project.professorName}</span>
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-secondary/20 text-secondary border-secondary/30 cursor-pointer hover:bg-secondary/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTag(project.professorName!);
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
                          <span>{formatDate(project.creationDate)}</span>
                        </div>
                        {project.course && (
                          <Badge variant="secondary" className="text-xs">
                            {project.course}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={projectToDelete !== null} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Projeto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
