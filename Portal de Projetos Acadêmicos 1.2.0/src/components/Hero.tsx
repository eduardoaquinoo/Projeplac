import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

interface HeroProps {
  onNavigateToCreateProject: () => void;
  onNavigateToProjects?: () => void;
  isLoggedIn?: boolean;
  onNavigateToLogin?: () => void;
}

export function Hero({ onNavigateToCreateProject, onNavigateToProjects, isLoggedIn = false, onNavigateToLogin }: HeroProps) {
  const handlePublishClick = () => {
    if (!isLoggedIn) {
      alert("Você precisa fazer login para publicar um projeto.");
      if (onNavigateToLogin) {
        onNavigateToLogin();
      }
    } else {
      onNavigateToCreateProject();
    }
  };
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              onClick={handlePublishClick}
            >
              Publicar Projeto
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}