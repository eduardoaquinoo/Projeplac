import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RichTextEditor } from "./RichTextEditor";
import { ArrowLeft, Save, FileText, Youtube, Github } from "lucide-react";
import { useState } from "react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

interface CreateProjectProps {
  onBack: () => void;
}

export function CreateProject({ onBack }: CreateProjectProps) {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    creationDate: "",
    projectLink: "",
    youtubeLink: "",
    githubLink: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria onde enviaria os dados para o backend
    console.log("Dados do projeto:", formData);
    alert("Projeto criado com sucesso! (Esta é uma simulação)");
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
                  maxLength={1000}
                />
                <p className="text-sm text-muted-foreground">
                  Use formatação para destacar informações importantes. Você pode adicionar links e imagens.
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

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center space-x-2 flex-1"
                >
                  <Save className="h-4 w-4" />
                  <span>Publicar Projeto</span>
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