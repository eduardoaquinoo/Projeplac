import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
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
  Heart,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Save
} from "lucide-react";
import { useState, useEffect } from "react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";
import { getManualFeatured, toggleManualFeatured, isManualFeatured, getLikesCount } from "../utils/likesManager";
import { getAllProjects, updateProjectStatus, deleteProject, ProjectStatus, Project } from "../utils/projectsManager";

interface AdminDashboardProps {
  onBack: () => void;
  onLogout: () => void;
  onNavigateToCreateAdmin?: () => void;
}

export function AdminDashboard({ onBack, onLogout, onNavigateToCreateAdmin }: AdminDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCourse, setFilterCourse] = useState<string>("all");
  const [featuredProjects, setFeaturedProjects] = useState<number[]>([]);
  const [projectLikes, setProjectLikes] = useState<{ [key: number]: number }>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  // Carregar projetos do localStorage
  const loadProjects = () => {
    const allProjects = getAllProjects();
    setProjects(allProjects);
    
    // Carrega contagem de likes
    const likes: { [key: number]: number } = {};
    allProjects.forEach(p => {
      likes[p.id] = getLikesCount(p.id);
    });
    setProjectLikes(likes);
  };

  useEffect(() => {
    loadProjects();
    setFeaturedProjects(getManualFeatured());
  }, []);

  const handleToggleFeatured = (projectId: number) => {
    const isFeatured = toggleManualFeatured(projectId);
    if (isFeatured) {
      setFeaturedProjects([...featuredProjects, projectId]);
    } else {
      setFeaturedProjects(featuredProjects.filter(id => id !== projectId));
    }
  };

  const handleStatusChange = (projectId: number, newStatus: ProjectStatus) => {
    const success = updateProjectStatus(projectId, newStatus);
    if (success) {
      loadProjects(); // Recarrega projetos após atualização
      console.log(`Status do projeto ${projectId} alterado para ${newStatus}`);
    }
  };

  const handleDeleteClick = (projectId: number) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete !== null) {
      const success = deleteProject(projectToDelete);
      if (success) {
        loadProjects(); // Recarrega projetos após exclusão
        console.log(`Projeto ${projectToDelete} excluído com sucesso`);
      }
    }
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
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
      }
    };

    const config = variants[status];
    return (
      <Badge className={`${config.color} border flex items-center space-x-1`}>
        {config.icon}
        <span>{status}</span>
      </Badge>
    );
  };

  // Filtragem de projetos
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    const matchesCourse = filterCourse === "all" || project.course === filterCourse;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Estatísticas
  const stats = {
    total: projects.length,
    published: projects.filter(p => p.status === "Publicado").length,
    inReview: projects.filter(p => p.status === "Em Revisão").length,
    inProgress: projects.filter(p => p.status === "Em Andamento").length
  };

  // Projetos por curso
  const projectsByCourse = {
    "Engenharia de Software": projects.filter(p => p.course.includes("Engenharia")).length,
    "Análise e Desenvolvimento": projects.filter(p => p.course.includes("Análise")).length,
    "Ciência da Computação": projects.filter(p => p.course.includes("Ciência")).length,
    "Sistemas de Informação": projects.filter(p => p.course.includes("Sistemas")).length
  };

  // Componente interno para listar administradores
  const AdminsList = () => {
    const [admins, setAdmins] = useState<any[]>([]);

    useEffect(() => {
      loadAdmins();
    }, []);

    const loadAdmins = () => {
      const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      // Adicionar o admin padrão
      const defaultAdmin = {
        name: 'Administrador Principal',
        email: 'admin@projeplac.com',
        createdAt: new Date().toISOString(),
        createdBy: 'Sistema',
        isDefault: true
      };
      setAdmins([defaultAdmin, ...adminUsers]);
    };

    return (
      <div className="space-y-4">
        {admins.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum administrador cadastrado além do padrão.
          </div>
        ) : (
          <div className="grid gap-4">
            {admins.map((admin, index) => (
              <div 
                key={index}
                className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center space-x-2">
                        <span>{admin.name}</span>
                        {admin.isDefault && (
                          <Badge variant="secondary" className="text-xs">Padrão</Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                      <div className="mt-2 text-xs text-muted-foreground space-y-1">
                        <p>Criado em: {new Date(admin.createdAt).toLocaleDateString('pt-BR')}</p>
                        <p>Criado por: {admin.createdBy}</p>
                      </div>
                    </div>
                  </div>
                  {!admin.isDefault && (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Componente interno para configurações de contato
  const ContactSettings = () => {
    interface ContactInfo {
      email: string;
      phone: string;
      location: string;
      socialMedia: {
        github: string;
        twitter: string;
        linkedin: string;
        instagram: string;
        facebook: string;
      };
    }

    const getDefaultContactInfo = (): ContactInfo => ({
      email: "eduardo.aquino@esoftware.uniceplac.edu.br",
      phone: "(61) 98282-9992",
      location: "Gama, DF - Brasil",
      socialMedia: {
        github: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#",
        facebook: "#"
      }
    });

    const [contactInfo, setContactInfo] = useState<ContactInfo>(getDefaultContactInfo());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
      const stored = localStorage.getItem('contactInfo');
      if (stored) {
        try {
          setContactInfo(JSON.parse(stored));
        } catch (e) {
          console.error('Erro ao carregar informações de contato:', e);
        }
      }
    }, []);

    const handleSave = () => {
      setIsSaving(true);
      try {
        localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
        alert('Informações de contato salvas com sucesso!');
      } catch (e) {
        console.error('Erro ao salvar informações de contato:', e);
        alert('Erro ao salvar informações de contato.');
      }
      setIsSaving(false);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Informações de Contato</CardTitle>
          <CardDescription>
            Configure as informações de contato exibidas no rodapé e na página de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>Informações Básicas</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>E-mail</span>
                </label>
                <Input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>Telefone</span>
                </label>
                <Input
                  type="text"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Localização</span>
              </label>
              <Input
                type="text"
                value={contactInfo.location}
                onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
                placeholder="Cidade, Estado - País"
              />
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Redes Sociais</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </label>
                <Input
                  type="url"
                  value={contactInfo.socialMedia.github}
                  onChange={(e) => setContactInfo({
                    ...contactInfo,
                    socialMedia: { ...contactInfo.socialMedia, github: e.target.value }
                  })}
                  placeholder="https://github.com/usuario"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </label>
                <Input
                  type="url"
                  value={contactInfo.socialMedia.twitter}
                  onChange={(e) => setContactInfo({
                    ...contactInfo,
                    socialMedia: { ...contactInfo.socialMedia, twitter: e.target.value }
                  })}
                  placeholder="https://twitter.com/usuario"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </label>
                <Input
                  type="url"
                  value={contactInfo.socialMedia.linkedin}
                  onChange={(e) => setContactInfo({
                    ...contactInfo,
                    socialMedia: { ...contactInfo.socialMedia, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/in/usuario"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </label>
                <Input
                  type="url"
                  value={contactInfo.socialMedia.instagram}
                  onChange={(e) => setContactInfo({
                    ...contactInfo,
                    socialMedia: { ...contactInfo.socialMedia, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/usuario"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Facebook className="h-4 w-4" />
                  <span>Facebook</span>
                </label>
                <Input
                  type="url"
                  value={contactInfo.socialMedia.facebook}
                  onChange={(e) => setContactInfo({
                    ...contactInfo,
                    socialMedia: { ...contactInfo.socialMedia, facebook: e.target.value }
                  })}
                  placeholder="https://facebook.com/usuario"
                />
              </div>
            </div>
          </div>

          {/* Botão de Salvar */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header do Dashboard Admin */}
      <div className="bg-primary text-primary-foreground border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-primary-foreground hover:bg-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-foreground/10 rounded-full">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
                  <p className="text-sm text-primary-foreground/80">Gerenciamento do Projeplac</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onNavigateToCreateAdmin}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Criar Novo Admin
              </Button>
              <Button
                variant="outline"
                onClick={onLogout}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              >
                Sair da Conta Admin
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
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <FolderKanban className="h-4 w-4 text-primary" />
                <span>Total de Projetos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Todos os projetos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Publicados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.published}</div>
              <p className="text-xs text-muted-foreground mt-1">Visíveis ao público</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span>Em Revisão</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.inReview}</div>
              <p className="text-xs text-muted-foreground mt-1">Aguardando aprovação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Em Andamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground mt-1">Em desenvolvimento</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Gerenciamento */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <FolderKanban className="h-4 w-4" />
              <span>Gerenciar Projetos</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Estatísticas</span>
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Administradores</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Contato</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab de Gerenciamento de Projetos */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Projetos</CardTitle>
                <CardDescription>
                  Aprove, rejeite ou modifique o status dos projetos enviados pelos alunos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filtros e Busca */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar projetos por título, descrição ou autor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="Publicado">Publicado</SelectItem>
                      <SelectItem value="Em Revisão">Em Revisão</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCourse} onValueChange={setFilterCourse}>
                    <SelectTrigger className="w-full md:w-[250px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrar por curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Cursos</SelectItem>
                      <SelectItem value="Engenharia de Software">Engenharia de Software</SelectItem>
                      <SelectItem value="Análise e Desenvolvimento de Sistemas">Análise e Desenvolvimento</SelectItem>
                      <SelectItem value="Ciência da Computação">Ciência da Computação</SelectItem>
                      <SelectItem value="Sistemas de Informação">Sistemas de Informação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lista de Projetos */}
                <div className="space-y-4">
                  {filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Nenhum projeto encontrado
                      </h3>
                      <p className="text-muted-foreground">
                        Tente ajustar os filtros ou aguarde novos projetos serem enviados.
                      </p>
                    </div>
                  ) : (
                    filteredProjects.map((project) => (
                      <Card key={project.id} className="border-border hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-semibold text-lg text-foreground">
                                  {project.title}
                                </h3>
                                {getStatusBadge(project.status)}
                                {featuredProjects.includes(project.id) && (
                                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                    <Star className="h-3 w-3 mr-1" />
                                    Destaque
                                  </Badge>
                                )}
                                {projectLikes[project.id] > 0 && (
                                  <Badge variant="outline" className="flex items-center space-x-1">
                                    <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                                    <span>{projectLikes[project.id]}</span>
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {project.summary}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{project.authorName}</span>
                                </span>
                                <span>•</span>
                                <span>{project.course}</span>
                                <span>•</span>
                                <span>{new Date(project.submittedAt).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <Select
                                value={project.status}
                                onValueChange={(value) => handleStatusChange(project.id, value as ProjectStatus)}
                              >
                                <SelectTrigger className="w-[160px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Em Revisão">Em Revisão</SelectItem>
                                  <SelectItem value="Publicado">Publicado</SelectItem>
                                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Button
                                variant={featuredProjects.includes(project.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleToggleFeatured(project.id)}
                                className="whitespace-nowrap"
                              >
                                <Star className={`h-4 w-4 mr-1 ${featuredProjects.includes(project.id) ? 'fill-current' : ''}`} />
                                {featuredProjects.includes(project.id) ? 'Destacado' : 'Destacar'}
                              </Button>

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteClick(project.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

          {/* Tab de Estatísticas */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Gerais</CardTitle>
                <CardDescription>Visão geral dos projetos por curso e status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Projetos por Curso</h3>
                  <div className="space-y-3">
                    {Object.entries(projectsByCourse).map(([course, count]) => (
                      <div key={course} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <span className="font-medium">{course}</span>
                        <Badge variant="secondary">{count} projetos</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Distribuição de Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-green-900">Publicados</h4>
                      </div>
                      <p className="text-3xl font-bold text-green-600">{stats.published}</p>
                      <p className="text-sm text-green-700 mt-1">
                        {stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0}% do total
                      </p>
                    </div>
                    
                    <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <h4 className="font-semibold text-yellow-900">Em Revisão</h4>
                      </div>
                      <p className="text-3xl font-bold text-yellow-600">{stats.inReview}</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {stats.total > 0 ? Math.round((stats.inReview / stats.total) * 100) : 0}% do total
                      </p>
                    </div>
                    
                    <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Em Andamento</h4>
                      </div>
                      <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                      <p className="text-sm text-blue-700 mt-1">
                        {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}% do total
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Administradores */}
          <TabsContent value="admins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Administradores</CardTitle>
                <CardDescription>
                  Visualize todos os administradores do sistema e crie novos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Botão para criar novo admin */}
                <div className="flex justify-end">
                  <Button
                    onClick={onNavigateToCreateAdmin}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Criar Novo Administrador
                  </Button>
                </div>

                {/* Lista de Administradores */}
                <AdminsList />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Informações de Contato */}
          <TabsContent value="contact" className="space-y-6">
            <ContactSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
