// Gerenciador centralizado de projetos

export type ProjectStatus = "Em Revisão" | "Publicado" | "Em Andamento";

export interface Project {
  id: number;
  title: string;
  summary: string;
  description: string;
  creationDate: string;
  projectLink: string;
  youtubeLink: string;
  githubLink: string;
  professorName: string;
  members: string[];
  thumbnailImage: string;
  screenshots: string[];
  tags: string[];
  status: ProjectStatus;
  authorId: string;
  authorName: string;
  course: string;
  submittedAt: string;
  publishedAt?: string;
}

const PROJECTS_STORAGE_KEY = 'projeplac_projects';

// Obter todos os projetos
export function getAllProjects(): Project[] {
  const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Obter projetos publicados (para exibição pública)
export function getPublishedProjects(): Project[] {
  return getAllProjects().filter(p => p.status === "Publicado");
}

// Obter projetos em revisão (para admin)
export function getProjectsInReview(): Project[] {
  return getAllProjects().filter(p => p.status === "Em Revisão");
}

// Obter projeto por ID
export function getProjectById(id: number): Project | undefined {
  return getAllProjects().find(p => p.id === id);
}

// Salvar novo projeto (sempre com status "Em Revisão")
export function saveNewProject(projectData: Omit<Project, 'id' | 'status' | 'submittedAt'>): Project {
  const projects = getAllProjects();
  
  const newProject: Project = {
    ...projectData,
    id: Date.now(), // ID único baseado em timestamp
    status: "Em Revisão",
    submittedAt: new Date().toISOString()
  };
  
  projects.push(newProject);
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  
  return newProject;
}

// Atualizar status do projeto
export function updateProjectStatus(projectId: number, newStatus: ProjectStatus): boolean {
  const projects = getAllProjects();
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) return false;
  
  projects[projectIndex].status = newStatus;
  
  // Se publicado, adiciona data de publicação
  if (newStatus === "Publicado" && !projects[projectIndex].publishedAt) {
    projects[projectIndex].publishedAt = new Date().toISOString();
  }
  
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  return true;
}

// Excluir projeto
export function deleteProject(projectId: number): boolean {
  const projects = getAllProjects();
  const filteredProjects = projects.filter(p => p.id !== projectId);
  
  if (filteredProjects.length === projects.length) {
    return false; // Projeto não encontrado
  }
  
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filteredProjects));
  return true;
}

// Atualizar projeto completo
export function updateProject(projectId: number, updates: Partial<Project>): boolean {
  const projects = getAllProjects();
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) return false;
  
  projects[projectIndex] = { ...projects[projectIndex], ...updates };
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  return true;
}

// Obter projetos por autor
export function getProjectsByAuthor(authorId: string): Project[] {
  return getAllProjects().filter(p => p.authorId === authorId);
}

// Obter projetos por curso
export function getProjectsByCourse(course: string): Project[] {
  return getPublishedProjects().filter(p => p.course === course);
}

// Buscar projetos (apenas publicados)
export function searchProjects(searchTerm: string): Project[] {
  const term = searchTerm.toLowerCase();
  return getPublishedProjects().filter(p => 
    p.title.toLowerCase().includes(term) ||
    p.summary.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term) ||
    p.tags.some(tag => tag.toLowerCase().includes(term)) ||
    p.authorName.toLowerCase().includes(term)
  );
}

// Inicializar com projetos de exemplo (apenas na primeira vez)
export function initializeSampleProjects() {
  const existing = getAllProjects();
  
  // Verifica se já tem todos os 17 projetos demo
  const demoProjectsCount = existing.filter(p => p.id >= 1 && p.id <= 17).length;
  if (demoProjectsCount === 17) return; // Já tem todos os demos
  
  const sampleProjects: Project[] = [
    {
      id: 1,
      title: "Sistema de Gestão Acadêmica",
      summary: "Plataforma web completa para gerenciamento de notas, frequência e desempenho dos alunos com dashboard intuitivo",
      description: `<h2>Sobre o Projeto</h2><p>Sistema completo de gestão acadêmica desenvolvido com React e Node.js, permitindo o controle de notas, frequência e comunicação entre professores e alunos.</p><h3>Funcionalidades Principais</h3><ul><li>Gerenciamento de notas e frequência</li><li>Dashboard com métricas de desempenho</li><li>Comunicação entre professores e alunos</li><li>Relatórios personalizados</li><li>Sistema de notificações em tempo real</li></ul><h3>Tecnologias Utilizadas</h3><p>O projeto foi desenvolvido utilizando as mais modernas tecnologias web, incluindo React para o frontend, Node.js e Express para o backend, e MongoDB como banco de dados.</p>`,
      creationDate: "2024-09-15",
      projectLink: "https://gestao-academica-demo.vercel.app",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/gestao-academica",
      professorName: "Prof. Eduardo Aquino",
      members: ["João Silva", "Maria Santos", "Carlos Henrique"],
      thumbnailImage: "https://images.unsplash.com/photo-1650525217641-891e936d3486?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMG1hbmFnZW1lbnQlMjBzeXN0ZW18ZW58MXx8fHwxNzYxNjEzMzE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
      ],
      tags: ["React", "Node.js", "MongoDB", "Web", "Dashboard", "Educação"],
      status: "Publicado",
      authorId: "24686",
      authorName: "João Silva",
      course: "Engenharia de Software",
      submittedAt: "2024-09-15T10:00:00.000Z",
      publishedAt: "2024-09-16T14:30:00.000Z"
    },
    {
      id: 2,
      title: "App Mobile de Delivery",
      summary: "Aplicativo de entrega de comida com rastreamento em tempo real e integração com restaurantes locais",
      description: `<h2>Visão Geral</h2><p>Aplicativo mobile desenvolvido em React Native que permite fazer pedidos de comida com rastreamento em tempo real do entregador.</p><h3>Recursos</h3><ul><li>Catálogo completo de restaurantes</li><li>Sistema de pedidos em tempo real</li><li>Rastreamento GPS do entregador</li><li>Pagamento integrado</li><li>Sistema de avaliações</li><li>Histórico de pedidos</li></ul><h3>Diferenciais</h3><p>Interface intuitiva e moderna, com foco na experiência do usuário. Sistema de notificações push para acompanhamento do pedido em todas as etapas.</p>`,
      creationDate: "2024-08-20",
      projectLink: "https://delivery-app-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/delivery-app",
      professorName: "Prof. Mariana Rocha",
      members: ["Pedro Costa", "Julia Oliveira", "Lucas Mendes", "Ana Beatriz"],
      thumbnailImage: "https://images.unsplash.com/photo-1642047291146-7916f38ebde0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBkZWxpdmVyeSUyMGFwcHxlbnwxfHx8fDE3NjE2MTMzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [
        "https://images.unsplash.com/photo-1642047291146-7916f38ebde0?w=800",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
      ],
      tags: ["React Native", "Mobile", "Firebase", "Maps API", "GPS", "E-commerce"],
      status: "Publicado",
      authorId: "user2",
      authorName: "Pedro Costa",
      course: "Análise e Desenvolvimento de Sistemas",
      submittedAt: "2024-08-20T10:00:00.000Z",
      publishedAt: "2024-08-21T14:30:00.000Z"
    },
    {
      id: 3,
      title: "Dashboard de Analytics em Tempo Real",
      summary: "Painel de visualização de dados e métricas em tempo real com gráficos interativos e relatórios customizáveis",
      description: `<h2>Descrição do Projeto</h2><p>Dashboard completo para visualização de dados com diversos tipos de gráficos e filtros personalizáveis, desenvolvido com as melhores práticas de UX/UI.</p><h3>Funcionalidades</h3><ul><li>Gráficos interativos em tempo real</li><li>Filtros personalizáveis</li><li>Exportação de relatórios em PDF/Excel</li><li>Alertas e notificações customizadas</li><li>Integração com múltiplas fontes de dados</li><li>Modo escuro/claro</li></ul><h3>Stack Tecnológica</h3><p>Desenvolvido com React, TypeScript, Recharts para visualizações, e integração com APIs RESTful para dados em tempo real.</p>`,
      creationDate: "2024-10-01",
      projectLink: "https://analytics-dashboard-demo.vercel.app",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/analytics-dashboard",
      professorName: "Prof. Roberto Oliveira",
      members: ["Ana Carolina", "Felipe Santos"],
      thumbnailImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2MTUyNTIxMXww&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
      ],
      tags: ["React", "TypeScript", "Charts", "Data Visualization", "Analytics", "Dashboard"],
      status: "Publicado",
      authorId: "user3",
      authorName: "Ana Carolina",
      course: "Ciência da Computação",
      submittedAt: "2024-10-01T10:00:00.000Z",
      publishedAt: "2024-10-02T14:30:00.000Z"
    },
    {
      id: 4,
      title: "IA para Diagnóstico Médico",
      summary: "Sistema de inteligência artificial para auxiliar no diagnóstico precoce de doenças através de análise de imagens",
      description: `<h2>Projeto de IA Médica</h2><p>Desenvolvimento de algoritmos de machine learning para auxiliar no diagnóstico precoce de doenças cardiovasculares através de análise de imagens médicas.</p><h3>Características</h3><ul><li>Análise automatizada de imagens médicas</li><li>Precisão de 94% nos testes</li><li>Redução de tempo de diagnóstico em 60%</li><li>Interface web intuitiva para médicos</li><li>Geração de relatórios detalhados</li></ul><h3>Impacto Social</h3><p>O projeto tem potencial para salvar vidas através do diagnóstico precoce, sendo desenvolvido em parceria com hospitais da região.</p>`,
      creationDate: "2024-11-10",
      projectLink: "https://ia-medica-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/ia-medica",
      professorName: "Prof. João Santos",
      members: ["Maria Silva", "Carlos Eduardo", "Patricia Lima"],
      thumbnailImage: "https://images.unsplash.com/photo-1758202292826-c40e172eed1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwbWVkaWNhbHxlbnwxfHx8fDE3NjE2MTMzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["IA", "Machine Learning", "Python", "TensorFlow", "Saúde", "Deep Learning"],
      status: "Publicado",
      authorId: "user4",
      authorName: "Maria Silva",
      course: "Ciência da Computação",
      submittedAt: "2024-11-10T10:00:00.000Z",
      publishedAt: "2024-11-11T14:30:00.000Z"
    },
    {
      id: 5,
      title: "Blockchain para Votação Eletrônica",
      summary: "Sistema de votação eletrônica seguro utilizando tecnologia blockchain para garantir transparência e auditabilidade",
      description: `<h2>Blockchain e Democracia</h2><p>Estudo sobre a aplicação de tecnologia blockchain para aumentar a transparência e eficiência em processos governamentais e votações eletrônicas.</p><h3>Recursos de Segurança</h3><ul><li>Criptografia de ponta a ponta</li><li>Auditabilidade completa</li><li>Impossibilidade de fraude</li><li>Anonimato do eleitor garantido</li><li>Verificação de integridade em tempo real</li></ul><h3>Tecnologias</h3><p>Utiliza Ethereum para smart contracts, Web3.js para integração, e React para interface do usuário.</p>`,
      creationDate: "2024-10-25",
      projectLink: "https://blockchain-voting-demo.com",
      youtubeLink: "",
      githubLink: "https://github.com/uniceplac/blockchain-voting",
      professorName: "Prof. Carlos Lima",
      members: ["Lucia Pereira", "Fernando Costa", "Gabriel Alves"],
      thumbnailImage: "https://images.unsplash.com/photo-1666816943035-15c29931e975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjE1NDYyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["Blockchain", "Web3", "Ethereum", "Criptografia", "Segurança", "Smart Contracts"],
      status: "Publicado",
      authorId: "user5",
      authorName: "Lucia Pereira",
      course: "Sistemas de Informação",
      submittedAt: "2024-10-25T10:00:00.000Z",
      publishedAt: "2024-10-26T14:30:00.000Z"
    },
    {
      id: 6,
      title: "Sistema IoT de Monitoramento Ambiental",
      summary: "Rede de sensores IoT para monitoramento de qualidade do ar, temperatura e umidade em tempo real",
      description: `<h2>IoT para o Meio Ambiente</h2><p>Rede de sensores IoT para monitoramento de qualidade do ar, temperatura e umidade em tempo real com alertas automatizados.</p><h3>Componentes do Sistema</h3><ul><li>Sensores de temperatura e umidade</li><li>Medidores de qualidade do ar (CO2, PM2.5)</li><li>Módulos de comunicação LoRaWAN</li><li>Dashboard web para visualização</li><li>Sistema de alertas via SMS/Email</li><li>API REST para integração</li></ul><h3>Hardware e Software</h3><p>Desenvolvido com Arduino/ESP32, protocolo MQTT, Node-RED para fluxo de dados, e React para dashboard web.</p>`,
      creationDate: "2024-09-30",
      projectLink: "https://iot-ambiente-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/iot-ambiental",
      professorName: "Prof. Eduardo Aquino",
      members: ["Lucas Rodrigues", "Mariana Costa", "Pedro Henrique"],
      thumbnailImage: "https://images.unsplash.com/photo-1650530224492-f5a8b6e77fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpb3QlMjBzZW5zb3JzJTIwZW52aXJvbm1lbnR8ZW58MXx8fHwxNzYxNjEzMzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["IoT", "Arduino", "Sensores", "MQTT", "Meio Ambiente", "ESP32"],
      status: "Publicado",
      authorId: "user6",
      authorName: "Lucas Rodrigues",
      course: "Engenharia de Software",
      submittedAt: "2024-09-30T10:00:00.000Z",
      publishedAt: "2024-10-01T14:30:00.000Z"
    },
    {
      id: 7,
      title: "Chatbot Inteligente com NLP",
      summary: "Sistema de atendimento automatizado utilizando processamento de linguagem natural e machine learning",
      description: `<h2>Atendimento Automatizado Inteligente</h2><p>Sistema de atendimento automatizado utilizando processamento de linguagem natural e machine learning para melhorar a experiência do usuário.</p><h3>Capacidades do Chatbot</h3><ul><li>Compreensão de linguagem natural</li><li>Respostas contextualizadas</li><li>Aprendizado contínuo</li><li>Integração com múltiplos canais</li><li>Análise de sentimento</li><li>Transferência para atendente humano quando necessário</li></ul><h3>Tecnologias de IA</h3><p>Utiliza modelos de NLP avançados, TensorFlow para treinamento, e Python para processamento de linguagem.</p>`,
      creationDate: "2024-08-15",
      projectLink: "https://chatbot-nlp-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/chatbot-nlp",
      professorName: "Prof. João Santos",
      members: ["Carlos Mendes", "Julia Ferreira"],
      thumbnailImage: "https://images.unsplash.com/photo-1757310998437-b2e8a7bd2e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGF0Ym90JTIwYXNzaXN0YW50fGVufDF8fHx8MTc2MTUyOTY5MHww&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["IA", "NLP", "Chatbot", "Python", "Machine Learning", "TensorFlow"],
      status: "Publicado",
      authorId: "user7",
      authorName: "Carlos Mendes",
      course: "Ciência da Computação",
      submittedAt: "2024-08-15T10:00:00.000Z",
      publishedAt: "2024-08-16T14:30:00.000Z"
    },
    {
      id: 8,
      title: "E-commerce com Realidade Aumentada",
      summary: "Plataforma de comércio eletrônico que utiliza AR para visualização de produtos em ambiente real antes da compra",
      description: `<h2>Compras com Realidade Aumentada</h2><p>Plataforma de comércio eletrônico que utiliza AR para visualização de produtos em ambiente real antes da compra.</p><h3>Recursos Inovadores</h3><ul><li>Visualização 3D de produtos</li><li>AR para experimentação virtual</li><li>Catálogo completo de produtos</li><li>Carrinho de compras inteligente</li><li>Sistema de pagamento seguro</li><li>Avaliações e comentários</li></ul><h3>Tecnologia AR</h3><p>Desenvolvido com ARKit/ARCore para mobile, Unity para renderização 3D, e React Native para aplicativo multiplataforma.</p>`,
      creationDate: "2024-07-20",
      projectLink: "https://ecommerce-ar-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/ecommerce-ar",
      professorName: "Prof. Mariana Rocha",
      members: ["Gabriel Alves", "Camila Torres", "Rafael Santos"],
      thumbnailImage: "https://images.unsplash.com/photo-1648643118664-c6f1c5ba0850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdWdtZW50ZWQlMjByZWFsaXR5JTIwc2hvcHBpbmd8ZW58MXx8fHwxNzYxNTE3Nzg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["AR", "E-commerce", "Unity", "Mobile", "3D", "React Native"],
      status: "Publicado",
      authorId: "user8",
      authorName: "Gabriel Alves",
      course: "Análise e Desenvolvimento de Sistemas",
      submittedAt: "2024-07-20T10:00:00.000Z",
      publishedAt: "2024-07-21T14:30:00.000Z"
    },
    {
      id: 9,
      title: "Rede Social para Estudantes",
      summary: "Plataforma social exclusiva para estudantes compartilharem conhecimento e colaborarem em projetos acadêmicos",
      description: `<h2>Rede Social Acadêmica</h2><p>Plataforma social desenvolvida especialmente para estudantes universitários compartilharem conhecimento, formarem grupos de estudo e colaborarem em projetos.</p><h3>Funcionalidades</h3><ul><li>Feed personalizado de conteúdo acadêmico</li><li>Grupos de estudo por disciplina</li><li>Compartilhamento de materiais e recursos</li><li>Sistema de mensagens e videochamadas</li><li>Marketplace de materiais usados</li><li>Agenda colaborativa de eventos</li></ul><h3>Tecnologia</h3><p>Desenvolvido com React Native para mobile, Node.js e Socket.io para comunicação em tempo real, MongoDB para banco de dados.</p>`,
      creationDate: "2024-06-15",
      projectLink: "https://rede-academica-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/rede-academica",
      professorName: "Prof. Mariana Rocha",
      members: ["Fernanda Lima", "Rodrigo Oliveira", "Camila Souza"],
      thumbnailImage: "https://images.unsplash.com/photo-1759932023688-9fa7516ddc6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMGFwcCUyMG1vYmlsZXxlbnwxfHx8fDE3NjE2MTM3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["React Native", "Mobile", "Socket.io", "Social", "Node.js", "MongoDB"],
      status: "Publicado",
      authorId: "user9",
      authorName: "Fernanda Lima",
      course: "Análise e Desenvolvimento de Sistemas",
      submittedAt: "2024-06-15T10:00:00.000Z",
      publishedAt: "2024-06-16T14:30:00.000Z"
    },
    {
      id: 10,
      title: "App de Fitness e Saúde",
      summary: "Aplicativo de acompanhamento de exercícios físicos e nutrição com planos personalizados e gamificação",
      description: `<h2>Fitness Tracker Completo</h2><p>Aplicativo mobile para acompanhamento de atividades físicas, nutrição e metas de saúde com sistema de gamificação para motivar usuários.</p><h3>Recursos Principais</h3><ul><li>Rastreamento de exercícios e calorias</li><li>Planos de treino personalizados</li><li>Diário alimentar com contador de calorias</li><li>Integração com wearables (smartwatches)</li><li>Sistema de conquistas e desafios</li><li>Gráficos de evolução e relatórios</li></ul><h3>Stack</h3><p>Flutter para aplicativo multiplataforma, Firebase para backend, integração com Google Fit e Apple Health.</p>`,
      creationDate: "2024-05-10",
      projectLink: "https://fitness-tracker-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/fitness-tracker",
      professorName: "Prof. João Santos",
      members: ["Rafael Santos", "Juliana Costa", "Thiago Almeida"],
      thumbnailImage: "https://images.unsplash.com/photo-1591311630200-ffa9120a540f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwdHJhY2tlciUyMGhlYWx0aCUyMGFwcHxlbnwxfHx8fDE3NjE2MTM3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["Flutter", "Mobile", "Firebase", "Saúde", "Gamificação", "API"],
      status: "Publicado",
      authorId: "user10",
      authorName: "Rafael Santos",
      course: "Análise e Desenvolvimento de Sistemas",
      submittedAt: "2024-05-10T10:00:00.000Z",
      publishedAt: "2024-05-11T14:30:00.000Z"
    },
    {
      id: 11,
      title: "Sistema de Automação Residencial",
      summary: "Plataforma IoT para controle inteligente de dispositivos domésticos com assistente virtual integrado",
      description: `<h2>Smart Home System</h2><p>Sistema completo de automação residencial utilizando IoT, permitindo controle de iluminação, temperatura, segurança e aparelhos eletrônicos.</p><h3>Funcionalidades</h3><ul><li>Controle por voz e aplicativo mobile</li><li>Automações baseadas em horários e sensores</li><li>Monitoramento de câmeras de segurança</li><li>Controle de temperatura e climatização</li><li>Gerenciamento de consumo energético</li><li>Integração com Alexa e Google Assistant</li></ul><h3>Tecnologias</h3><p>Raspberry Pi, Arduino, MQTT, React Native, Python para automações, Node-RED para fluxos.</p>`,
      creationDate: "2024-04-05",
      projectLink: "https://smart-home-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/smart-home",
      professorName: "Prof. Carlos Lima",
      members: ["Bruno Cardoso", "Larissa Mendes"],
      thumbnailImage: "https://images.unsplash.com/photo-1679356505858-bf4129177392?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGhvbWUlMjBhdXRvbWF0aW9ufGVufDF8fHx8MTc2MTUxODU5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["IoT", "Raspberry Pi", "Arduino", "MQTT", "Python", "Automação"],
      status: "Publicado",
      authorId: "user11",
      authorName: "Bruno Cardoso",
      course: "Engenharia de Software",
      submittedAt: "2024-04-05T10:00:00.000Z",
      publishedAt: "2024-04-06T14:30:00.000Z"
    },
    {
      id: 12,
      title: "Plataforma de Streaming de Vídeo",
      summary: "Serviço de streaming de vídeos educacionais com sistema de assinatura e conteúdo exclusivo para estudantes",
      description: `<h2>Streaming Educacional</h2><p>Plataforma de streaming focada em conteúdo educacional, similar ao Netflix, com cursos, palestras e aulas organizadas por categoria.</p><h3>Recursos</h3><ul><li>Biblioteca de vídeos organizada por temas</li><li>Sistema de assinatura e pagamentos</li><li>Player adaptativo com múltiplas resoluções</li><li>Download para visualização offline</li><li>Sistema de comentários e avaliações</li><li>Recomendações personalizadas por IA</li></ul><h3>Stack Tecnológica</h3><p>React para frontend, AWS para hospedagem de vídeos, Node.js e Express para API, PostgreSQL para dados.</p>`,
      creationDate: "2024-03-20",
      projectLink: "https://edu-streaming-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/edu-streaming",
      professorName: "Prof. Roberto Oliveira",
      members: ["Amanda Silva", "Gustavo Fernandes", "Patricia Rocha"],
      thumbnailImage: "https://images.unsplash.com/photo-1760404699953-1c4867967c83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHN0cmVhbWluZyUyMHBsYXRmb3JtfGVufDF8fHx8MTc2MTYxMzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["React", "AWS", "Streaming", "Video", "Node.js", "PostgreSQL"],
      status: "Publicado",
      authorId: "user12",
      authorName: "Amanda Silva",
      course: "Sistemas de Informação",
      submittedAt: "2024-03-20T10:00:00.000Z",
      publishedAt: "2024-03-21T14:30:00.000Z"
    },
    {
      id: 13,
      title: "App de Receitas Culinárias",
      summary: "Aplicativo de receitas com reconhecimento de ingredientes por foto e sugestões personalizadas baseadas em preferências",
      description: `<h2>Cookbook Digital Inteligente</h2><p>Aplicativo mobile que auxilia na escolha de receitas baseado nos ingredientes disponíveis, com reconhecimento por câmera e IA.</p><h3>Funcionalidades</h3><ul><li>Reconhecimento de ingredientes por foto</li><li>Sugestões de receitas baseadas em ingredientes</li><li>Modo passo a passo com timer</li><li>Lista de compras inteligente</li><li>Compartilhamento de receitas</li><li>Filtros por dieta (vegano, sem glúten, etc)</li></ul><h3>Tecnologias</h3><p>React Native, TensorFlow para reconhecimento de imagens, Firebase para backend, API de receitas.</p>`,
      creationDate: "2024-02-28",
      projectLink: "https://cookbook-app-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/cookbook-app",
      professorName: "Prof. Mariana Rocha",
      members: ["Carolina Santos", "Diego Oliveira"],
      thumbnailImage: "https://images.unsplash.com/photo-1758874960056-07aa3d0afa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNpcGUlMjBjb29raW5nJTIwYXBwfGVufDF8fHx8MTc2MTYxMzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["React Native", "IA", "TensorFlow", "Mobile", "Firebase", "Computer Vision"],
      status: "Publicado",
      authorId: "user13",
      authorName: "Carolina Santos",
      course: "Ciência da Computação",
      submittedAt: "2024-02-28T10:00:00.000Z",
      publishedAt: "2024-02-29T14:30:00.000Z"
    },
    {
      id: 14,
      title: "Gerenciador Financeiro Pessoal",
      summary: "Aplicativo de controle financeiro com análise de gastos por IA e alertas inteligentes de economia",
      description: `<h2>Finanças Pessoais Inteligentes</h2><p>Aplicativo completo para gerenciamento de finanças pessoais com categorização automática de gastos e insights por inteligência artificial.</p><h3>Recursos</h3><ul><li>Sincronização com contas bancárias</li><li>Categorização automática de transações</li><li>Metas de economia e orçamento</li><li>Relatórios e gráficos detalhados</li><li>Alertas de gastos excessivos</li><li>Planejamento financeiro com IA</li></ul><h3>Stack</h3><p>Flutter para mobile, Python com FastAPI para backend, Machine Learning para análises, PostgreSQL.</p>`,
      creationDate: "2024-01-15",
      projectLink: "https://finance-manager-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/finance-manager",
      professorName: "Prof. Eduardo Aquino",
      members: ["Matheus Costa", "Isabela Ferreira", "Leonardo Silva"],
      thumbnailImage: "https://images.unsplash.com/photo-1652422485224-102f6784c149?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBidWRnZXQlMjBhcHB8ZW58MXx8fHwxNzYxNjEzNzA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["Flutter", "Python", "FastAPI", "Machine Learning", "Finanças", "Mobile"],
      status: "Publicado",
      authorId: "user14",
      authorName: "Matheus Costa",
      course: "Engenharia de Software",
      submittedAt: "2024-01-15T10:00:00.000Z",
      publishedAt: "2024-01-16T14:30:00.000Z"
    },
    {
      id: 15,
      title: "Plataforma de Aprendizado de Idiomas",
      summary: "Aplicativo gamificado para aprendizado de idiomas com reconhecimento de voz e prática conversacional com IA",
      description: `<h2>Language Learning AI</h2><p>Plataforma interativa para aprendizado de idiomas que utiliza gamificação, reconhecimento de voz e conversação com IA para ensinar de forma efetiva.</p><h3>Funcionalidades</h3><ul><li>Lições progressivas gamificadas</li><li>Reconhecimento de pronúncia</li><li>Conversação com chatbot de IA</li><li>Flashcards inteligentes com espaçamento</li><li>Prática de escuta e leitura</li><li>Desafios diários e rankings</li></ul><h3>Tecnologias</h3><p>React Native para mobile, Python com NLP para processamento de linguagem, Web Speech API, Firebase.</p>`,
      creationDate: "2023-12-10",
      projectLink: "https://language-learning-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/language-learning",
      professorName: "Prof. João Santos",
      members: ["Beatriz Lima", "Vinicius Rodrigues"],
      thumbnailImage: "https://images.unsplash.com/photo-1589395937658-0557e7d89fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGxlYXJuaW5nJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc2MTYxMzcwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["React Native", "NLP", "IA", "Educação", "Gamificação", "Speech Recognition"],
      status: "Publicado",
      authorId: "user15",
      authorName: "Beatriz Lima",
      course: "Ciência da Computação",
      submittedAt: "2023-12-10T10:00:00.000Z",
      publishedAt: "2023-12-11T14:30:00.000Z"
    },
    {
      id: 16,
      title: "App de Previsão do Tempo com IA",
      summary: "Aplicativo de previsão meteorológica com alertas personalizados e recomendações baseadas em machine learning",
      description: `<h2>Weather Intelligence</h2><p>Aplicativo de previsão do tempo que utiliza machine learning para análises precisas e recomendações personalizadas de atividades.</p><h3>Recursos</h3><ul><li>Previsão detalhada para 15 dias</li><li>Alertas de condições climáticas severas</li><li>Recomendações de vestimenta</li><li>Radar meteorológico em tempo real</li><li>Qualidade do ar e índice UV</li><li>Histórico e análises climáticas</li></ul><h3>Stack</h3><p>React Native, integração com múltiplas APIs meteorológicas, Python para ML, charts para visualizações.</p>`,
      creationDate: "2023-11-22",
      projectLink: "https://weather-ai-demo.com",
      youtubeLink: "",
      githubLink: "https://github.com/uniceplac/weather-ai",
      professorName: "Prof. Roberto Oliveira",
      members: ["Felipe Martins", "Aline Souza", "Ricardo Pereira"],
      thumbnailImage: "https://images.unsplash.com/photo-1705077564892-4d0560b1f4a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWF0aGVyJTIwZm9yZWNhc3QlMjBhcHBsaWNhdGlvbnxlbnwxfHx8fDE3NjE2MTM3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["React Native", "Machine Learning", "API", "Mobile", "Python", "Data Science"],
      status: "Publicado",
      authorId: "user16",
      authorName: "Felipe Martins",
      course: "Sistemas de Informação",
      submittedAt: "2023-11-22T10:00:00.000Z",
      publishedAt: "2023-11-23T14:30:00.000Z"
    },
    {
      id: 17,
      title: "Game VR de Educação Histórica",
      summary: "Jogo em realidade virtual que permite explorar eventos históricos de forma imersiva e educativa",
      description: `<h2>História em Realidade Virtual</h2><p>Experiência educacional imersiva em VR que transporta estudantes para diferentes períodos históricos, permitindo exploração interativa.</p><h3>Funcionalidades</h3><ul><li>Exploração 3D de cenários históricos</li><li>Interação com personagens históricos</li><li>Missões educativas e quizzes</li><li>Multiplayer para aulas em grupo</li><li>Narração e contexto histórico</li><li>Compatível com Oculus e HTC Vive</li></ul><h3>Tecnologias</h3><p>Unity 3D para desenvolvimento, C# para programação, modelagem 3D, integração com headsets VR.</p>`,
      creationDate: "2023-10-18",
      projectLink: "https://history-vr-demo.com",
      youtubeLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      githubLink: "https://github.com/uniceplac/history-vr",
      professorName: "Prof. Carlos Lima",
      members: ["André Luiz", "Melissa Torres", "Caio Henrique"],
      thumbnailImage: "https://images.unsplash.com/photo-1643837706361-4615d2e4a8de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwcmVhbGl0eSUyMGdhbWluZ3xlbnwxfHx8fDE3NjE1ODI5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      screenshots: [],
      tags: ["VR", "Unity", "C#", "Game Dev", "Educação", "3D"],
      status: "Publicado",
      authorId: "user17",
      authorName: "André Luiz",
      course: "Engenharia de Software",
      submittedAt: "2023-10-18T10:00:00.000Z",
      publishedAt: "2023-10-19T14:30:00.000Z"
    }
  ];
  
  // Preserva projetos do usuário (IDs > 17) e adiciona os demos
  const userProjects = existing.filter(p => p.id > 17);
  const allProjects = [...sampleProjects, ...userProjects];
  
  console.log(`[ProjectsManager] Inicializando ${sampleProjects.length} projetos demo + ${userProjects.length} projetos de usuário = ${allProjects.length} total`);
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(allProjects));
}

// Função para resetar TODOS os projetos e recriar apenas os demos
export function resetToSampleProjects() {
  console.log('[ProjectsManager] Resetando todos os projetos e recriando demos...');
  localStorage.removeItem(PROJECTS_STORAGE_KEY);
  initializeSampleProjects();
  const projects = getAllProjects();
  console.log(`[ProjectsManager] Total de projetos após reset: ${projects.length}`);
}
