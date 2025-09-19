import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Code, 
  Database, 
  Computer, 
  Network
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Engenharia de Software",
    icon: Code,
    count: 0,
    color: "bg-primary",
    description: "Desenvolvimento, Arquitetura, Metodologias Ágeis"
  },
  {
    id: 2,
    name: "Análise e Desenvolvimento de Sistemas",
    icon: Database,
    count: 0,
    color: "bg-secondary",
    description: "Análise de Requisitos, Modelagem, Desenvolvimento"
  },
  {
    id: 3,
    name: "Ciência da Computação",
    icon: Computer,
    count: 0,
    color: "bg-primary",
    description: "Algoritmos, Estruturas de Dados, Inteligência Artificial"
  },
  {
    id: 4,
    name: "Sistemas de Informação",
    icon: Network,
    count: 0,
    color: "bg-secondary",
    description: "Gestão de TI, Business Intelligence, ERP"
  }
];

export function Categories() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore projetos por Curso
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra projetos organizados por área de conhecimento
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id} 
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 ${category.color} rounded-full text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="text-sm font-medium text-primary mb-4">
                    {category.count} projetos
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    Explorar
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Ver Todas as Categorias
          </Button>
        </div>
      </div>
    </section>
  );
}