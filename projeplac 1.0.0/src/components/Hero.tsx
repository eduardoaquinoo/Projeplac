import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowRight, BookOpen, Users, Award } from "lucide-react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

interface HeroProps {
  onNavigateToCreateProject: () => void;
  onNavigateToProjects?: () => void;
}

export function Hero({ onNavigateToCreateProject, onNavigateToProjects }: HeroProps) {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo grande para a tela de boas-vindas */}
          <div className="flex justify-center mb-8">
            <img 
              src={projeplacLogo} 
              alt="Projeplac Logo" 
              className="h-60 w-auto"
            />
          </div>

          {/* Título e descrição */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Bem-vindo ao{" "}
            <span className="text-primary">Proje</span>
            <span className="text-secondary">plac</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            O portal definitivo para divulgação de projetos acadêmicos. 
            Conecte-se com alunos da UNICEPLAC, compartilhe suas descobertas e 
            colabore no avanço da ciência e tecnologia.
          </p>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={onNavigateToProjects}
            >
              Explorar Projetos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-secondary text-secondary hover:bg-secondary hover:text-white"
              onClick={onNavigateToCreateProject}
            >
              Publicar Projeto
            </Button>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">1</h3>
              <p className="text-muted-foreground">Projetos Publicados</p>
            </Card>

            <Card className="p-6 text-center border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                <a 
                  href="https://www.uniceplac.edu.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  UNICEPLAC
                </a>
              </h3>
              <p className="text-muted-foreground">Instituição Parceira</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}