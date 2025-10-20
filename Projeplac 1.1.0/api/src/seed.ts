import { db, ProjectStatus } from "./db.js";

interface SeedProject {
  title: string;
  summary: string;
  description: string;
  category: string;
  course: string;
  status: ProjectStatus;
  shift: string;
  class: string;
  semester: string;
  professor: string;
  author: string;
  authorEmail: string;
  projectUrl: string;
  githubUrl: string;
  youtubeUrl: string;
  thumbnail?: string;
  tags: string[];
  members: Array<{ name: string; role: string }>;
  createdAt: string;
}

const insertProjectStmt = db.prepare(
  /* sql */ `
  INSERT INTO projects (
    title,
    summary,
    description,
    category,
    course,
    status,
    shift,
    class,
    semester,
    professor,
    author,
    author_email,
    project_url,
    github_url,
    youtube_url,
    thumbnail,
    created_at,
    updated_at,
    views
  ) VALUES (
    @title,
    @summary,
    @description,
    @category,
    @course,
    @status,
    @shift,
    @class,
    @semester,
    @professor,
    @author,
    @authorEmail,
    @projectUrl,
    @githubUrl,
    @youtubeUrl,
    @thumbnail,
    @createdAt,
    @createdAt,
    @views
  )
`
);

const insertMemberStmt = db.prepare(
  /* sql */ `
  INSERT INTO project_members (project_id, name, role)
  VALUES (@projectId, @name, @role)
`
);

const findTagStmt = db.prepare(
  /* sql */ `
  SELECT id FROM tags WHERE name = ?
`
);

const insertTagStmt = db.prepare(
  /* sql */ `
  INSERT INTO tags (name) VALUES (?)
`
);

const linkProjectTagStmt = db.prepare(
  /* sql */ `
  INSERT OR IGNORE INTO project_tags (project_id, tag_id)
  VALUES (@projectId, @tagId)
`
);

const truncateTables = () => {
  db.exec("PRAGMA foreign_keys = OFF;");
  db.exec("DELETE FROM project_tags;");
  db.exec("DELETE FROM project_members;");
  db.exec("DELETE FROM tags;");
  db.exec("DELETE FROM projects;");
  db.exec("PRAGMA foreign_keys = ON;");
};

const projects: SeedProject[] = [
  {
    title: "Sistema de Gestão Acadêmica",
    summary:
      "Plataforma web para gerenciamento de alunos, professores e disciplinas.",
    description:
      "Sistema completo de gestão acadêmica com módulos de notas, frequência, relatórios e dashboards personalizados para cada perfil de usuário.",
    category: "Engenharia de Software",
    course: "Engenharia de Software",
    status: "Publicado",
    shift: "Noturno",
    class: "ES-2024-2",
    semester: "8º Semestre",
    professor: "Prof. Dr. Maria Santos",
    author: "João Silva",
    authorEmail: "joao.silva@estudante.uniceplac.edu.br",
    projectUrl: "https://sistema-academico-demo.vercel.app",
    githubUrl: "https://github.com/joao/sistema-academico",
    youtubeUrl: "https://youtube.com/watch?v=exemplo1",
    thumbnail:
      "https://images.unsplash.com/photo-1636034890787-84c842228065?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    members: [
      { name: "João Silva", role: "Autor" },
      { name: "Maria Souza", role: "Desenvolvedor(a)" },
      { name: "Rodrigo Lima", role: "UX Designer" },
    ],
    createdAt: "2024-12-18T10:00:00.000Z",
  },
  {
    title: "App Mobile para Controle Financeiro",
    summary:
      "Aplicativo mobile para controle de finanças pessoais com relatórios.",
    description:
      "Aplicativo React Native que permite registrar receitas, despesas e acompanhar gráficos de gasto mensal com alertas personalizados.",
    category: "Análise e Desenvolvimento de Sistemas",
    course: "Análise e Desenvolvimento de Sistemas",
    status: "Em Andamento",
    shift: "Matutino",
    class: "ADS-2024-1",
    semester: "6º Semestre",
    professor: "Prof. Carlos Lima",
    author: "Ana Costa",
    authorEmail: "ana.costa@estudante.uniceplac.edu.br",
    projectUrl: "https://github.com/ana/finance-app",
    githubUrl: "https://github.com/ana/finance-app",
    youtubeUrl: "https://youtube.com/watch?v=exemplo2",
    thumbnail:
      "https://images.unsplash.com/photo-1613442301287-4fa478efd9ca?auto=format&fit=crop&w=800&q=80",
    tags: ["React Native", "Firebase", "Charts"],
    members: [
      { name: "Ana Costa", role: "Autor(a)" },
      { name: "Pedro Henrique", role: "Desenvolvedor(a)" },
    ],
    createdAt: "2024-11-20T09:30:00.000Z",
  },
  {
    title: "IA para Reconhecimento de Padrões",
    summary:
      "Projeto de pesquisa com modelos de machine learning para imagens médicas.",
    description:
      "Rede neural convolucional treinada com dataset de imagens médicas para auxiliar diagnósticos por meio de classificação de padrões.",
    category: "Ciência da Computação",
    course: "Ciência da Computação",
    status: "Em Revisão",
    shift: "Vespertino",
    class: "CC-2024-2",
    semester: "7º Semestre",
    professor: "Prof. Dra. Lucia Pereira",
    author: "Pedro Oliveira",
    authorEmail: "pedro.oliveira@estudante.uniceplac.edu.br",
    projectUrl: "https://github.com/pedro/ia-padroes",
    githubUrl: "https://github.com/pedro/ia-padroes",
    youtubeUrl: "https://youtube.com/watch?v=exemplo3",
    thumbnail:
      "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?auto=format&fit=crop&w=800&q=80",
    tags: ["Python", "TensorFlow", "OpenCV"],
    members: [
      { name: "Pedro Oliveira", role: "Autor" },
      { name: "Larissa Gomes", role: "Cientista de Dados" },
    ],
    createdAt: "2025-01-05T12:15:00.000Z",
  },
  {
    title: "Sistema ERP para PMEs",
    summary: "ERP com módulos financeiros, estoque e recursos humanos para PMEs.",
    description:
      "Solução ERP pensada para pequenas empresas com implantação rápida e interface amigável. Inclui módulos financeiros, estoque, RH e vendas.",
    category: "Sistemas de Informação",
    course: "Sistemas de Informação",
    status: "Publicado",
    shift: "Noturno",
    class: "SI-2024-2",
    semester: "8º Semestre",
    professor: "Prof. Roberto Oliveira",
    author: "Mariana Santos",
    authorEmail: "mariana.santos@estudante.uniceplac.edu.br",
    projectUrl: "https://erp-pme-demo.com",
    githubUrl: "https://github.com/mariana/erp-pme",
    youtubeUrl: "https://youtube.com/watch?v=exemplo4",
    thumbnail:
      "https://images.unsplash.com/photo-1728917330520-9456e3f49529?auto=format&fit=crop&w=800&q=80",
    tags: ["Java", "Spring Boot", "MySQL"],
    members: [
      { name: "Mariana Santos", role: "Autor(a)" },
      { name: "Igor Mendes", role: "Backend" },
      { name: "Patrícia Xavier", role: "Analista" },
    ],
    createdAt: "2024-12-01T16:45:00.000Z",
  },
  {
    title: "Blockchain para Votação Eletrônica",
    summary: "Plataforma de votação com smart contracts para auditoria transparente.",
    description:
      "Sistema de votação descentralizado utilizando blockchain para garantir integridade, anonimato e auditabilidade das eleições acadêmicas.",
    category: "Engenharia de Software",
    course: "Engenharia de Software",
    status: "Em Revisão",
    shift: "Matutino",
    class: "ES-2024-1",
    semester: "7º Semestre",
    professor: "Prof. Dr. Maria Santos",
    author: "Lucas Ferreira",
    authorEmail: "lucas.ferreira@estudante.uniceplac.edu.br",
    projectUrl: "https://voting-blockchain-demo.eth",
    githubUrl: "https://github.com/lucas/voting-blockchain",
    youtubeUrl: "https://youtube.com/watch?v=exemplo5",
    thumbnail:
      "https://images.unsplash.com/photo-1631864032970-68d79f6b7158?auto=format&fit=crop&w=800&q=80",
    tags: ["Solidity", "Ethereum", "Web3"],
    members: [
      { name: "Lucas Ferreira", role: "Autor" },
      { name: "Thaís Monteiro", role: "Smart Contracts" },
    ],
    createdAt: "2024-10-15T08:00:00.000Z",
  },
];

const ensureTag = (name: string): number => {
  const existing = findTagStmt.get(name) as { id: number } | undefined;
  if (existing?.id) {
    return existing.id;
  }
  const result = insertTagStmt.run(name);
  return Number(result.lastInsertRowid);
};

const seed = db.transaction(() => {
  projects.forEach((project, index) => {
    const result = insertProjectStmt.run({
      ...project,
      views: 100 + index * 25,
    });
    const projectId = Number(result.lastInsertRowid);

    project.members.forEach((member) => {
      insertMemberStmt.run({ projectId, ...member });
    });

    project.tags.forEach((tagName) => {
      const tagId = ensureTag(tagName);
      linkProjectTagStmt.run({ projectId, tagId });
    });
  });
});

try {
  truncateTables();
  seed();
  console.log("✅ Banco SQLite populado com sucesso!");
} catch (error) {
  console.error("❌ Erro ao popular banco:", error);
  process.exitCode = 1;
}
