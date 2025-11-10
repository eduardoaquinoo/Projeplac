import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RichTextEditor } from "./RichTextEditor";
import { Badge } from "./ui/badge";
import { ProfileIcon } from "./ProfileIcon";
import { ArrowLeft, Save, FileText, Youtube, Github, Users, Briefcase, X, Plus, UserPlus, Image as ImageIcon, Upload, Tag, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";
import { updateProject, getProjectById } from "../utils/projectsManager";

// Tags pré-definidas organizadas por categoria
const PREDEFINED_TAGS = {
  "Linguagens": ["JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "PHP", "Ruby", "Go", "Rust", "Kotlin", "Swift"],
  "Frontend": ["React", "Vue.js", "Angular", "Next.js", "Svelte", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Material UI"],
  "Backend": ["Node.js", "Express", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET", "FastAPI", "NestJS"],
  "Mobile": ["React Native", "Flutter", "Android", "iOS", "Ionic", "Xamarin"],
  "Banco de Dados": ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "SQLite", "Redis", "Oracle", "SQL Server"],
  "DevOps": ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure", "Google Cloud", "Git", "Jenkins"],
  "IA & Data": ["Machine Learning", "Deep Learning", "IA", "TensorFlow", "PyTorch", "Data Science", "NLP", "Computer Vision"],
  "Áreas": ["Web", "Mobile", "Desktop", "IoT", "Cloud", "Blockchain", "AR/VR", "Game Dev", "Segurança", "Big Data"],
  "Outros": ["API", "REST", "GraphQL", "Microservices", "Agile", "Scrum", "UX/UI", "Testes", "Performance"]
};

interface EditProjectProps {
  onBack: () => void;
  projectId: number;
}

export function EditProject({ onBack, projectId }: EditProjectProps) {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    creationDate: "",
    projectLink: "",
    youtubeLink: "",
    githubLink: "",
    professorName: "",
    members: [] as string[],
    thumbnailImage: "",
    screenshots: [] as string[],
    tags: [] as string[]
  });

  const [newMemberName, setNewMemberName] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [loading, setLoading] = useState(true);

  // Carregar dados do projeto ao montar o componente
  useEffect(() => {
    const project = getProjectById(projectId);
    if (project) {
      setFormData({
        title: project.title || "",
        summary: project.summary || project.description || "",
        description: project.description || project.summary || "",
        creationDate: project.creationDate || project.date || "",
        projectLink: project.projectLink || "",
        youtubeLink: project.youtubeLink || "",
        githubLink: project.githubLink || "",
        professorName: project.professorName || project.professor || "",
        members: project.members || [],
        thumbnailImage: project.thumbnailImage || project.image || project.imageUrl || "",
        screenshots: project.screenshots || [],
        tags: project.tags || []
      });
      setThumbnailPreview(project.thumbnailImage || project.image || project.imageUrl || "");
      setScreenshotPreviews(project.screenshots || []);
    }
    setLoading(false);
  }, [projectId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addMember = () => {
    if (newMemberName.trim()) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, newMemberName.trim()]
      }));
      setNewMemberName("");
    }
  };

  const removeMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setThumbnailPreview(result);
        setFormData(prev => ({
          ...prev,
          thumbnailImage: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailPreview("");
    setFormData(prev => ({
      ...prev,
      thumbnailImage: ""
    }));
  };

  const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setScreenshotPreviews(prev => [...prev, result]);
        setFormData(prev => ({
          ...prev,
          screenshots: [...prev.screenshots, result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeScreenshot = (index: number) => {
    setScreenshotPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => {
      const isSelected = prev.tags.includes(tag);
      return {
        ...prev,
        tags: isSelected 
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      };
    });
  };

  const addCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag.trim()]
      }));
      setCustomTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.title.trim()) {
      alert("Por favor, preencha o título do projeto.");
      return;
    }
    if (!formData.summary.trim()) {
      alert("Por favor, preencha o resumo do projeto.");
      return;
    }
    if (!formData.description.trim()) {
      alert("Por favor, preencha a descrição do projeto.");
      return;
    }
    
    // Atualizar projeto
    const success = updateProject(projectId, {
      title: formData.title,
      summary: formData.summary,
      description: formData.description,
      creationDate: formData.creationDate,
      projectLink: formData.projectLink,
      youtubeLink: formData.youtubeLink,
      githubLink: formData.githubLink,
      professorName: formData.professorName,
      members: formData.members,
      thumbnailImage: formData.thumbnailImage,
      screenshots: formData.screenshots,
      tags: formData.tags
    });
    
    if (success) {
      console.log("Projeto atualizado:", projectId);
      alert("Projeto atualizado com sucesso!");
      onBack();
    } else {
      alert("Erro ao atualizar o projeto. Por favor, tente novamente.");
    }
  };

  const currentUserData = localStorage.getItem('currentUser');
  const currentUser = currentUserData ? JSON.parse(currentUserData) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header da Página */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Meus Projetos
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Pencil className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Editar Projeto</h1>
              <p className="text-muted-foreground">
                Atualize as informações do seu projeto acadêmico
              </p>
            </div>
          </div>

          {/* Informações do Usuário */}
          {currentUser && (
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <ProfileIcon type={currentUser.type || "aluno"} size="md" />
                  <div>
                    <p className="font-medium text-foreground">
                      {currentUser.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.type === "professor" ? "Professor" : "Aluno"} - {currentUser.course || "Curso não especificado"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Preencha as informações principais do seu projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Projeto *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Sistema de Gerenciamento Acadêmico"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="summary">Resumo do Projeto *</Label>
                <Textarea
                  id="summary"
                  placeholder="Breve descrição do projeto (máximo 200 caracteres)"
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  className="mt-1.5 h-24"
                  maxLength={200}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.summary.length}/200 caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="description">Descrição Detalhada *</Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  placeholder="Descreva seu projeto em detalhes: objetivos, funcionalidades, tecnologias utilizadas, desafios enfrentados, resultados obtidos..."
                />
              </div>

              <div>
                <Label htmlFor="creationDate">Data de Criação/Semestre</Label>
                <Input
                  id="creationDate"
                  placeholder="Ex: Dezembro 2024 ou 2º Semestre 2024"
                  value={formData.creationDate}
                  onChange={(e) => handleInputChange("creationDate", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5 text-primary" />
                Links e Recursos
              </CardTitle>
              <CardDescription>
                Adicione links para o projeto, vídeos e repositórios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectLink" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Link do Projeto (deploy, demo)
                </Label>
                <Input
                  id="projectLink"
                  type="url"
                  placeholder="https://seu-projeto.com"
                  value={formData.projectLink}
                  onChange={(e) => handleInputChange("projectLink", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="youtubeLink" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-500" />
                  Link do Vídeo (YouTube)
                </Label>
                <Input
                  id="youtubeLink"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.youtubeLink}
                  onChange={(e) => handleInputChange("youtubeLink", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="githubLink" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  Link do Repositório (GitHub)
                </Label>
                <Input
                  id="githubLink"
                  type="url"
                  placeholder="https://github.com/usuario/projeto"
                  value={formData.githubLink}
                  onChange={(e) => handleInputChange("githubLink", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professor e Equipe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Professor e Equipe
              </CardTitle>
              <CardDescription>
                Adicione informações sobre o professor orientador e membros da equipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="professorName" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Nome do Professor Orientador
                </Label>
                <Input
                  id="professorName"
                  placeholder="Ex: Prof. Dr. João Silva"
                  value={formData.professorName}
                  onChange={(e) => handleInputChange("professorName", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Membros da Equipe
                </Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    placeholder="Nome do membro"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addMember();
                      }
                    }}
                  />
                  <Button type="button" onClick={addMember} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.members.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.members.map((member, index) => (
                      <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                        {member}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 ml-1 hover:bg-transparent"
                          onClick={() => removeMember(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Imagens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Imagens do Projeto
              </CardTitle>
              <CardDescription>
                Adicione uma imagem de capa e capturas de tela do projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Thumbnail */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Upload className="h-4 w-4" />
                  Imagem de Capa
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img 
                        src={thumbnailPreview} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeThumbnail}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <Label htmlFor="thumbnail" className="cursor-pointer">
                        <span className="text-primary hover:text-primary/80">
                          Clique para fazer upload
                        </span>
                        <span className="text-muted-foreground"> ou arraste uma imagem</span>
                      </Label>
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Screenshots */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Upload className="h-4 w-4" />
                  Capturas de Tela (opcional)
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <Label htmlFor="screenshots" className="cursor-pointer">
                    <span className="text-primary hover:text-primary/80">
                      Clique para adicionar screenshots
                    </span>
                  </Label>
                  <Input
                    id="screenshots"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleScreenshotsChange}
                  />
                </div>
                {screenshotPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {screenshotPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeScreenshot(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Tags e Tecnologias
              </CardTitle>
              <CardDescription>
                Selecione as tecnologias e áreas relacionadas ao projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tags selecionadas */}
              {formData.tags.length > 0 && (
                <div>
                  <Label className="mb-2 block">Tags Selecionadas:</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="default" className="pl-3 pr-1 py-1 bg-primary">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 ml-1 hover:bg-transparent"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags pré-definidas por categoria */}
              <div className="space-y-4">
                {Object.entries(PREDEFINED_TAGS).map(([category, tags]) => (
                  <div key={category}>
                    <Label className="mb-2 block">{category}:</Label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={formData.tags.includes(tag) ? "default" : "outline"}
                          className={`cursor-pointer transition-colors ${
                            formData.tags.includes(tag) 
                              ? "bg-primary hover:bg-primary/90" 
                              : "hover:bg-primary/10"
                          }`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tag customizada */}
              <div>
                <Label className="mb-2 block">Adicionar Tag Personalizada:</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite uma tag personalizada"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addCustomTag} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
