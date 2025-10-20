import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RichTextEditor } from "./RichTextEditor";
import { Badge } from "./ui/badge";
import { ProfileIcon } from "./ProfileIcon";
import { ArrowLeft, Save, FileText, Youtube, Github, Users, X, Plus, Image as ImageIcon, Upload, Tag } from "lucide-react";
import { useState } from "react";
import { api } from "../utils/api";

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

const INITIAL_FORM_STATE = {
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
  tags: [] as string[],
};

interface CreateProjectProps {
  onBack: () => void;
}

export function CreateProject({ onBack }: CreateProjectProps) {
  const [formData, setFormData] = useState({ ...INITIAL_FORM_STATE });

  const [newMemberName, setNewMemberName] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const resetForm = () => {
    setFormData({
      ...INITIAL_FORM_STATE,
      members: [],
      screenshots: [],
      tags: [],
    });
    setThumbnailPreview("");
    setScreenshotPreviews([]);
    setCustomTag("");
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!formData.title.trim()) {
      setSubmitMessage({
        type: "error",
        text: "Informe um título para o projeto.",
      });
      return;
    }

    if (!formData.summary.trim()) {
      setSubmitMessage({
        type: "error",
        text: "Descreva um resumo para o projeto.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await api.createProject({
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        description: formData.description,
        professor: formData.professorName.trim() || undefined,
        projectUrl: formData.projectLink.trim() || undefined,
        youtubeUrl: formData.youtubeLink.trim() || undefined,
        githubUrl: formData.githubLink.trim() || undefined,
        thumbnail: formData.thumbnailImage || undefined,
        tags: formData.tags,
        members: formData.members.map((name) => ({
          name,
        })),
      });

      setSubmitMessage({
        type: "success",
        text: "Projeto cadastrado com sucesso! Ele aparecerá na listagem assim que for publicado.",
      });
      resetForm();
    } catch (err) {
      setSubmitMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Não foi possível salvar o projeto. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Criar Novo Projeto Acadêmico
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compartilhe seu projeto acadêmico com a comunidade da UNICEPLAC. 
            Preencha as informações abaixo para divulgar seu trabalho.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-primary">Informações do Projeto</CardTitle>
            <CardDescription>
              Todos os campos são obrigatórios para a publicação do projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título do Projeto */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Título do Projeto
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Digite o título do seu projeto acadêmico"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Resumo do Projeto */}
              <div className="space-y-2">
                <Label htmlFor="summary" className="text-foreground">
                  Resumo do Projeto
                </Label>
                <Textarea
                  id="summary"
                  placeholder="Descreva resumidamente o que seu projeto irá fazer, seus objetivos e principais características..."
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary min-h-32 resize-y"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Mínimo de 50 caracteres. Seja claro e objetivo.
                </p>
              </div>

              {/* Descreva seu Projeto */}
              <div className="space-y-2">
                <Label className="text-foreground">
                  Descreva seu Projeto
                </Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  placeholder="Descreva detalhadamente seu projeto, metodologia, tecnologias utilizadas, resultados esperados..."
                  maxLength={10000}
                />
                <p className="text-sm text-muted-foreground">
                  Use formatação para destacar informações importantes. Você pode adicionar links e imagens. Máximo de 10.000 caracteres.
                </p>
              </div>

              {/* Imagem de Destaque */}
              <div className="space-y-2">
                <Label htmlFor="thumbnailImage" className="text-foreground flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <span>Imagem de Destaque (Thumbnail)</span>
                  <Badge variant="secondary" className="text-xs">
                    Recomendado
                  </Badge>
                </Label>
                
                {thumbnailPreview ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-border">
                    <img 
                      src={thumbnailPreview} 
                      alt="Preview da imagem" 
                      className="w-full h-64 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Input
                      id="thumbnailImage"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                    <Label 
                      htmlFor="thumbnailImage"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Clique para fazer upload da imagem
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, JPEG ou WEBP (Máx. 5MB)
                        </p>
                      </div>
                    </Label>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Esta imagem será exibida como destaque do projeto na galeria e busca
                </p>
              </div>

              {/* Screenshots do Projeto */}
              <div className="space-y-2">
                <Label htmlFor="screenshots" className="text-foreground flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <span>Screenshots do Projeto</span>
                  {screenshotPreviews.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {screenshotPreviews.length} {screenshotPreviews.length === 1 ? 'imagem' : 'imagens'}
                    </Badge>
                  )}
                </Label>

                {/* Grid de Screenshots */}
                {screenshotPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {screenshotPreviews.map((preview, index) => (
                      <div 
                        key={index}
                        className="relative rounded-lg overflow-hidden border-2 border-border group"
                      >
                        <img 
                          src={preview} 
                          alt={`Screenshot ${index + 1}`} 
                          className="w-full h-40 object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeScreenshot(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Área de Upload */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Input
                    id="screenshots"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleScreenshotsChange}
                    className="hidden"
                  />
                  <Label 
                    htmlFor="screenshots"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <div className="p-3 bg-secondary/10 rounded-full">
                      <Upload className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Clique para adicionar screenshots
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Você pode selecionar múltiplas imagens de uma vez
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, JPEG ou WEBP (Máx. 5MB cada)
                      </p>
                    </div>
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Adicione capturas de tela que demonstrem as funcionalidades e interface do seu projeto
                </p>
              </div>

              {/* Data de Criação */}
              <div className="space-y-2">
                <Label htmlFor="creationDate" className="text-foreground">
                  Data de Criação
                </Label>
                <Input
                  id="creationDate"
                  type="date"
                  value={formData.creationDate}
                  onChange={(e) => handleInputChange("creationDate", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  min="2020-01-01"
                  max="2030-12-31"
                  required
                />
              </div>

              {/* Seção de Equipe do Projeto */}
              <div className="border-t border-border pt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Equipe do Projeto
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Adicione os membros da equipe e o professor orientador do projeto
                  </p>
                </div>

                {/* Professor Orientador */}
                <div className="space-y-2 mb-6">
                  <Label htmlFor="professorName" className="text-foreground flex items-center space-x-2">
                    <ProfileIcon type="professor" size="sm" />
                    <span>Professor Orientador</span>
                    <Badge variant="secondary" className="text-xs">
                      Obrigatório
                    </Badge>
                  </Label>
                  <Input
                    id="professorName"
                    type="text"
                    placeholder="Digite o nome completo do professor orientador"
                    value={formData.professorName}
                    onChange={(e) => handleInputChange("professorName", e.target.value)}
                    className="bg-input-background border-border focus:border-primary focus:ring-primary"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    O professor será marcado com uma tag especial para facilitar a busca
                  </p>
                </div>

                {/* Membros do Projeto */}
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center space-x-2">
                    <ProfileIcon type="aluno" size="sm" />
                    <span>Membros do Projeto (Alunos)</span>
                  </Label>
                  
                  {/* Lista de membros adicionados */}
                  {formData.members.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 p-3 bg-muted/30 rounded-md">
                      {formData.members.map((member, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="flex items-center gap-2 pr-1 py-1.5"
                        >
                          <ProfileIcon type="aluno" size="sm" />
                          <span>{member}</span>
                          <button
                            type="button"
                            onClick={() => removeMember(index)}
                            className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                          >
                            <X className="h-3 w-3 text-destructive" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Campo para adicionar novo membro */}
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Digite o nome do aluno participante"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addMember();
                        }
                      }}
                      className="bg-input-background border-border focus:border-primary focus:ring-primary flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addMember}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Adicione todos os alunos que participaram do desenvolvimento do projeto
                  </p>
                </div>
              </div>

              {/* Link do Projeto */}
              <div className="space-y-2">
                <Label htmlFor="projectLink" className="text-foreground">
                  Link do Projeto
                </Label>
                <Input
                  id="projectLink"
                  type="url"
                  placeholder="Digite o link para o seu projeto"
                  value={formData.projectLink}
                  onChange={(e) => handleInputChange("projectLink", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Link do Video no YouTube */}
              <div className="space-y-2">
                <Label htmlFor="youtubeLink" className="text-foreground flex items-center space-x-2">
                  <Youtube className="h-4 w-4 text-primary" />
                  <span>Link do Video no YouTube</span>
                </Label>
                <Input
                  id="youtubeLink"
                  type="url"
                  placeholder="Digite o link do video no YouTube"
                  value={formData.youtubeLink}
                  onChange={(e) => handleInputChange("youtubeLink", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Link do GitHub */}
              <div className="space-y-2">
                <Label htmlFor="githubLink" className="text-foreground flex items-center space-x-2">
                  <Github className="h-4 w-4 text-primary" />
                  <span>Link do GitHub</span>
                </Label>
                <Input
                  id="githubLink"
                  type="url"
                  placeholder="Digite o link do repositório no GitHub"
                  value={formData.githubLink}
                  onChange={(e) => handleInputChange("githubLink", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Seção de Tags */}
              <div className="border-t border-border pt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Tags do Projeto
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione tags que descrevem as tecnologias e áreas do seu projeto
                  </p>
                </div>

                {/* Tags Selecionadas */}
                {formData.tags.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Tags Selecionadas ({formData.tags.length})
                    </Label>
                    <div className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-md border border-primary/20">
                      {formData.tags.map((tag) => (
                        <Badge 
                          key={tag}
                          variant="default"
                          className="bg-primary text-primary-foreground flex items-center gap-1 pr-1 py-1.5"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 rounded-full p-0.5 hover:bg-primary-foreground/20 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags Pré-definidas por Categoria */}
                <div className="space-y-4">
                  {Object.entries(PREDEFINED_TAGS).map(([category, tags]) => (
                    <div key={category}>
                      <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                        {category}
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => {
                          const isSelected = formData.tags.includes(tag);
                          return (
                            <Badge
                              key={tag}
                              variant={isSelected ? "default" : "outline"}
                              className={`cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : "hover:bg-muted hover:border-primary/50"
                              }`}
                              onClick={() => toggleTag(tag)}
                            >
                              {tag}
                              {isSelected && <X className="h-3 w-3 ml-1" />}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adicionar Tag Personalizada */}
                <div className="mt-4 pt-4 border-t border-border">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Adicionar Tag Personalizada
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Digite uma tag personalizada..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomTag();
                        }
                      }}
                      className="bg-input-background border-border focus:border-primary focus:ring-primary flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addCustomTag}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Caso não encontre a tag desejada nas sugestões, você pode criar uma personalizada
                  </p>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-primary-foreground flex items-center justify-center space-x-2 flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Publicar Projeto</span>
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="border-secondary text-secondary hover:bg-secondary hover:text-white flex-1"
                >
                  Cancelar
                </Button>
              </div>
              {submitMessage && (
                <p
                  className={`text-sm ${submitMessage.type === "success" ? "text-green-600" : "text-red-600"}`}
                >
                  {submitMessage.text}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="mt-8 p-6 bg-accent rounded-lg border border-accent-foreground/20">
          <h3 className="font-semibold text-accent-foreground mb-2">
            Dicas para um bom projeto
          </h3>
          <ul className="text-sm text-accent-foreground/80 space-y-1">
            <li>• Use um título claro e descritivo</li>
            <li>• No resumo, explique o problema que seu projeto resolve</li>
            <li>• Na descrição detalhada, use formatação para organizar as informações</li>
            <li>• Mencione as tecnologias ou metodologias utilizadas</li>
            <li>• Indique se o projeto está em desenvolvimento ou concluído</li>
            <li>• Adicione imagens para ilustrar seu projeto</li>
            <li>• Inclua links para recursos relevantes</li>
            <li>• Adicione um vídeo explicativo no YouTube para demonstrar o funcionamento</li>
            <li>• Compartilhe o código-fonte no GitHub para outros estudantes aprenderem</li>
            <li>• Certifique-se de que todos os links estejam funcionando e acessíveis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
