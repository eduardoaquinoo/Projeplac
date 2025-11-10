import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, GraduationCap, MapPin, Globe } from "lucide-react";

export function PartnerInstitution() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Instituição Parceira
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça a instituição que apoia e promove a excelência acadêmica
          </p>
        </div>

        <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Lado esquerdo - Imagem */}
            <div className="relative h-64 lg:h-auto bg-gradient-to-br from-primary to-primary/80">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center">
                  <GraduationCap className="h-24 w-24 text-primary-foreground mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-primary-foreground mb-2">
                    UNICEPLAC
                  </h3>
                  <p className="text-primary-foreground/90 text-lg">
                    Centro Universitário do Planalto Central
                  </p>
                </div>
              </div>
            </div>

            {/* Lado direito - Informações */}
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Sobre a UNICEPLAC
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                O Centro Universitário do Planalto Central Apparecido dos Santos - UNICEPLAC é uma instituição 
                de ensino superior comprometida com a excelência acadêmica e o desenvolvimento de profissionais 
                qualificados para o mercado de trabalho.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-foreground">Localização</div>
                    <div className="text-muted-foreground">Gama, DF - Brasil</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-foreground">Cursos</div>
                    <div className="text-muted-foreground">
                      Engenharia de Software, Análise e Desenvolvimento de Sistemas, 
                      Ciência da Computação, Sistemas de Informação e mais
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-foreground">Missão</div>
                    <div className="text-muted-foreground">
                      Formar profissionais competentes, éticos e comprometidos com o 
                      desenvolvimento social e tecnológico
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                onClick={() => window.open('https://www.uniceplac.edu.br/', '_blank')}
              >
                Visitar Site da UNICEPLAC
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
