import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { 
  ArrowLeft, 
  ExternalLink, 
  Users, 
  Calendar, 
  Youtube,
  Github,
  Globe,
  User,
  GraduationCap,
  Clock,
  Building,
  BookOpen
} from "lucide-react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

interface ProjectDetailsProps {
  onBack: () => void;
  projectId: number;
}

// Mock data - em um app real, isso viria de uma API ou estado global
const projects = [
  {
    id: 1,
    title: "Sistema de Gestão Acadêmica",
    description: "Plataforma web completa para gerenciamento de alunos, professores e disciplinas com interface moderna e responsiva. O sistema permite cadastro de estudantes, controle de notas, geração de relatórios, comunicação entre professores e alunos, além de um dashboard administrativo robusto.",
    fullDescription: `Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) com o objetivo de modernizar os processos acadêmicos da UNICEPLAC. 

O sistema oferece uma interface intuitiva e responsiva, desenvolvida com React e TypeScript, garantindo uma experiência de usuário fluida tanto para estudantes quanto para professores e administradores.

**Principais Funcionalidades:**
- Dashboard personalizado para cada tipo de usuário
- Sistema de autenticação e autorização robusto
- Módulo de cadastro e gestão de alunos
- Controle acadêmico com notas e frequência
- Sistema de comunicação integrado
- Relatórios detalhados e análises de desempenho
- Interface responsiva para acesso mobile

**Tecnologias Utilizadas:**
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, JWT
- Banco de Dados: PostgreSQL
- Deploy: Docker, AWS

**Resultados Alcançados:**
O sistema foi implementado em fase piloto e resultou em 40% de redução no tempo de processamento de dados acadêmicos e 95% de satisfação dos usuários testadores.`,
    category: "Engenharia de Software",
    course: "Engenharia de Software",
    author: "João Silva",
    authorEmail: "joao.silva@estudante.uniceplac.edu.br",
    professor: "Prof. Dr. Maria Santos",
    professorEmail: "maria.santos@uniceplac.edu.br",
    semester: "8º Semestre",
    shift: "Noturno",
    class: "ES-2024-2",
    date: "Dezembro 2024",
    status: "Concluído",
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript", "Tailwind CSS", "AWS"],
    projectLink: "https://sistema-academico-demo.vercel.app",
    youtubeLink: "https://youtube.com/watch?v=exemplo1",
    githubLink: "https://github.com/joao/sistema-academico",
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop"
    ]
  },
  {
    id: 2,
    title: "App Mobile para Controle Financeiro",
    description: "Aplicativo React Native para controle de finanças pessoais com gráficos e relatórios detalhados.",
    fullDescription: `Aplicativo mobile desenvolvido para auxiliar usuários no controle e planejamento de suas finanças pessoais. O projeto surgiu da necessidade de criar uma ferramenta simples e eficaz para gestão financeira pessoal.

**Principais Funcionalidades:**
- Cadastro de receitas e despesas
- Categorização automática de transações
- Gráficos interativos de gastos
- Relatórios mensais e anuais
- Alertas de gastos excessivos
- Sincronização entre dispositivos

**Tecnologias Utilizadas:**
- React Native
- Firebase (Auth e Database)
- Chart.js para gráficos
- Push Notifications

**Impacto:**
Mais de 100 downloads na fase de testes com usuários da UNICEPLAC.`,
    category: "Análise e Desenvolvimento de Sistemas",
    course: "Análise e Desenvolvimento de Sistemas",
    author: "Ana Costa",
    authorEmail: "ana.costa@estudante.uniceplac.edu.br",
    professor: "Prof. Carlos Lima",
    professorEmail: "carlos.lima@uniceplac.edu.br",
    semester: "6º Semestre",
    shift: "Matutino",
    class: "ADS-2024-1",
    date: "Novembro 2024",
    status: "Em Andamento",
    tags: ["React Native", "Firebase", "Charts", "Mobile"],
    projectLink: "https://github.com/ana/finance-app",
    youtubeLink: "https://youtube.com/watch?v=exemplo2",
    githubLink: "https://github.com/ana/finance-app",
    images: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop"
    ]
  },
  {
    id: 3,
    title: "IA para Reconhecimento de Padrões",
    description: "Algoritmo de machine learning para reconhecimento de padrões em imagens médicas usando TensorFlow.",
    fullDescription: `Projeto de pesquisa focado no desenvolvimento de algoritmos de inteligência artificial para auxiliar profissionais de saúde no diagnóstico através de análise de imagens médicas.

**Objetivo:**
Desenvolver um sistema de IA capaz de identificar padrões em exames de imagem, auxiliando médicos no diagnóstico precoce de patologias.

**Metodologia:**
- Coleta e preparação de dataset de imagens médicas
- Implementação de redes neurais convolucionais
- Treinamento com técnicas de data augmentation
- Validação com métricas de precisão e recall

**Resultados Preliminares:**
- Precisão de 87% na detecção de padrões
- Tempo de processamento reduzido em 60%
- Interface web para visualização dos resultados`,
    category: "Ciência da Computação",
    course: "Ciência da Computação",
    author: "Pedro Oliveira",
    authorEmail: "pedro.oliveira@estudante.uniceplac.edu.br",
    professor: "Prof. Dra. Lucia Pereira",
    professorEmail: "lucia.pereira@uniceplac.edu.br",
    semester: "7º Semestre",
    shift: "Vespertino",
    class: "CC-2024-2",
    date: "Janeiro 2025",
    status: "Em Revisão",
    tags: ["Python", "TensorFlow", "OpenCV", "Machine Learning", "IA"],
    projectLink: "https://github.com/pedro/ia-padroes",
    youtubeLink: "https://youtube.com/watch?v=exemplo3",
    githubLink: "https://github.com/pedro/ia-padroes",
    images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop"
    ]
  },
  {
    id: 4,
    title: "Sistema ERP para PMEs",
    description: "Solução completa de gestão empresarial para pequenas e médias empresas com módulos integrados.",
    fullDescription: `Sistema ERP (Enterprise Resource Planning) desenvolvido especificamente para atender as necessidades de pequenas e médias empresas brasileiras.

**Módulos Desenvolvidos:**
- Gestão Financeira
- Controle de Estoque
- Vendas e CRM
- Recursos Humanos
- Relatórios Gerenciais

**Diferenciais:**
- Interface simplificada e intuitiva
- Custo acessível para PMEs
- Implementação rápida
- Suporte em português
- Integração com sistemas nacionais

**Tecnologias:**
- Backend: Java Spring Boot
- Frontend: Angular
- Banco: MySQL
- Cloud: Google Cloud Platform`,
    category: "Sistemas de Informação",
    course: "Sistemas de Informação",
    author: "Mariana Santos",
    authorEmail: "mariana.santos@estudante.uniceplac.edu.br",
    professor: "Prof. Roberto Oliveira",
    professorEmail: "roberto.oliveira@uniceplac.edu.br",
    semester: "8º Semestre",
    shift: "Noturno",
    class: "SI-2024-2",
    date: "Dezembro 2024",
    status: "Publicado",
    tags: ["Java", "Spring", "MySQL", "ERP", "Angular"],
    projectLink: "https://erp-pme-demo.com",
    youtubeLink: "https://youtube.com/watch?v=exemplo4",
    githubLink: "https://github.com/mariana/erp-pme",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
    ]
  },
  {
    id: 5,
    title: "Blockchain para Votação Eletrônica",
    description: "Sistema de votação descentralizado usando blockchain para garantir transparência e segurança.",
    fullDescription: `Projeto inovador que aplica tecnologia blockchain para criar um sistema de votação eletrônica seguro, transparente e auditável.

**Características Principais:**
- Descentralização total do processo
- Criptografia avançada
- Transparência e auditabilidade
- Impossibilidade de fraude
- Anonimato dos votantes

**Tecnologias Blockchain:**
- Ethereum para smart contracts
- Solidity para programação
- Web3.js para integração
- IPFS para armazenamento distribuído

**Aplicações Potenciais:**
- Eleições estudantis
- Assembleias corporativas
- Pesquisas de opinião
- Votações governamentais`,
    category: "Engenharia de Software",
    course: "Engenharia de Software",
    author: "Lucas Ferreira",
    authorEmail: "lucas.ferreira@estudante.uniceplac.edu.br",
    professor: "Prof. Dr. Maria Santos",
    professorEmail: "maria.santos@uniceplac.edu.br",
    semester: "7º Semestre",
    shift: "Matutino",
    class: "ES-2024-1",
    date: "Outubro 2024",
    status: "Concluído",
    tags: ["Solidity", "Web3", "React", "Blockchain", "Ethereum"],
    projectLink: "https://voting-blockchain-demo.eth",
    youtubeLink: "https://youtube.com/watch?v=exemplo5",
    githubLink: "https://github.com/lucas/voting-blockchain",
    images: [
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=400&fit=crop"
    ]
  },
  {
    id: 6,
    title: "Dashboard de Analytics",
    description: "Plataforma de visualização de dados com dashboards interativos para análise de métricas empresariais.",
    fullDescription: `Plataforma completa de Business Intelligence desenvolvida para auxiliar empresas na tomada de decisões baseada em dados.

**Funcionalidades Principais:**
- Dashboards customizáveis
- Relatórios automáticos
- Integração com múltiplas fontes de dados
- Análises preditivas
- Alertas inteligentes

**Tecnologias de Visualização:**
- Vue.js para interface reativa
- D3.js para gráficos customizados
- MongoDB para big data
- Python para análise de dados

**Benefícios:**
- Redução de 50% no tempo de análise
- Maior precisão nas decisões
- ROI mensurável para clientes`,
    category: "Análise e Desenvolvimento de Sistemas",
    course: "Análise e Desenvolvimento de Sistemas",
    author: "Sofia Rodriguez",
    authorEmail: "sofia.rodriguez@estudante.uniceplac.edu.br",
    professor: "Prof. Carlos Lima",
    professorEmail: "carlos.lima@uniceplac.edu.br",
    semester: "5º Semestre",
    shift: "Vespertino",
    class: "ADS-2024-2",
    date: "Janeiro 2025",
    status: "Em Andamento",
    tags: ["Vue.js", "D3.js", "MongoDB", "Analytics", "BI"],
    projectLink: "https://analytics-dashboard-demo.com",
    youtubeLink: "https://youtube.com/watch?v=exemplo6",
    githubLink: "https://github.com/sofia/analytics-dashboard",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
    ]
  }
];

export function ProjectDetails({ onBack, projectId }: ProjectDetailsProps) {
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Projeto não encontrado</h2>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header do Projeto */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  variant="secondary" 
                  className={project.status === 'Publicado' ? 'bg-primary text-primary-foreground' : 
                            project.status === 'Concluído' ? 'bg-green-500 text-white' :
                            project.status === 'Em Andamento' ? 'bg-secondary text-secondary-foreground' : 
                            'bg-muted text-muted-foreground'}
                >
                  {project.status}
                </Badge>
                <Badge variant="outline" className="text-primary border-primary">
                  {project.category}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {project.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                {project.description}
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => window.open(project.projectLink, '_blank')}
              >
                <Globe className="h-4 w-4 mr-2" />
                Ver Projeto
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(project.youtubeLink, '_blank')}
              >
                <Youtube className="h-4 w-4 mr-2 text-red-600" />
                Assistir Demo
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(project.githubLink, '_blank')}
              >
                <Github className="h-4 w-4 mr-2" />
                Código Fonte
              </Button>
            </div>
          </div>
        </div>

        {/* Grid de Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal - Descrição */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Imagens do Projeto */}
            {project.images && project.images.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Screenshots do Projeto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Screenshot ${index + 1} do projeto ${project.title}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Descrição Completa */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Sobre o Projeto
              </h3>
              <div className="prose prose-sm max-w-none">
                {project.fullDescription.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h4 key={index} className="font-semibold text-foreground mt-4 mb-2">
                        {paragraph.replace(/\*\*/g, '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <li key={index} className="text-muted-foreground ml-4">
                        {paragraph.substring(2)}
                      </li>
                    );
                  }
                  if (paragraph.trim() === '') {
                    return <br key={index} />;
                  }
                  return (
                    <p key={index} className="text-muted-foreground mb-3">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </Card>

            {/* Tecnologias */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Tecnologias Utilizadas</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

          </div>

          {/* Sidebar - Informações */}
          <div className="space-y-6">
            
            {/* Informações do Projeto */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Informações do Projeto</h3>
              <div className="space-y-4">
                
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Data de Conclusão</p>
                    <p className="text-sm text-muted-foreground">{project.date}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Curso</p>
                    <p className="text-sm text-muted-foreground">{project.course}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Semestre</p>
                    <p className="text-sm text-muted-foreground">{project.semester}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Turno</p>
                    <p className="text-sm text-muted-foreground">{project.shift}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Turma</p>
                    <p className="text-sm text-muted-foreground">{project.class}</p>
                  </div>
                </div>

              </div>
            </Card>

            {/* Informações do Autor */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Autor do Projeto</h3>
              <div className="space-y-4">
                
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{project.author}</p>
                    <a 
                      href={`mailto:${project.authorEmail}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {project.authorEmail}
                    </a>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Professor Orientador</p>
                    <p className="text-sm text-muted-foreground mb-1">{project.professor}</p>
                    <a 
                      href={`mailto:${project.professorEmail}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {project.professorEmail}
                    </a>
                  </div>
                </div>

              </div>
            </Card>

            {/* Links Externos */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Links do Projeto</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open(project.projectLink, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Projeto Online
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open(project.youtubeLink, '_blank')}
                >
                  <Youtube className="h-4 w-4 mr-2 text-red-600" />
                  Demo no YouTube
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open(project.githubLink, '_blank')}
                >
                  <Github className="h-4 w-4 mr-2" />
                  Código no GitHub
                </Button>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}