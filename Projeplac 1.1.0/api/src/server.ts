import "dotenv/config";
import express from "express";
import cors from "cors";

import { db, CreateProjectInput, ProjectRow, ProjectStatus } from "./db";

const app = express();

const PORT = process.env.PORT ?? "3333";

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const membersByProjectStmt = db.prepare(
  /* sql */ `
  SELECT id, name, role
  FROM project_members
  WHERE project_id = ?
  ORDER BY id
`
);

const tagsByProjectStmt = db.prepare(
  /* sql */ `
  SELECT t.name
  FROM tags t
  INNER JOIN project_tags pt ON pt.tag_id = t.id
  WHERE pt.project_id = ?
  ORDER BY t.name
`
);

const projectByIdStmt = db.prepare(
  /* sql */ `
  SELECT
    id,
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
    views,
    created_at,
    updated_at
  FROM projects
  WHERE id = ?
`
);

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
    updated_at
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
    @created_at,
    @updated_at
  )
`
);

const updateProjectStatusStmt = db.prepare(
  /* sql */ `
  UPDATE projects
  SET status = @status,
      updated_at = datetime('now')
  WHERE id = @id
`
);

const insertMemberStmt = db.prepare(
  /* sql */ `
  INSERT INTO project_members (project_id, name, role)
  VALUES (@projectId, @name, @role)
`
);

const findTagIdStmt = db.prepare(
  /* sql */ `
  SELECT id FROM tags WHERE name = ?
`
);

const insertTagStmt = db.prepare(
  /* sql */ `
  INSERT INTO tags (name) VALUES (?)
`
);

const linkTagToProjectStmt = db.prepare(
  /* sql */ `
  INSERT OR IGNORE INTO project_tags (project_id, tag_id)
  VALUES (@projectId, @tagId)
`
);

interface ProjectMember {
  id: number;
  name: string;
  role: string | null;
}

interface ProjectResponse {
  id: number;
  title: string;
  summary: string | null;
  description: string | null;
  category: string | null;
  course: string | null;
  status: ProjectStatus;
  shift: string | null;
  class: string | null;
  semester: string | null;
  professor: string | null;
  author: string | null;
  authorEmail: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  youtubeUrl: string | null;
  thumbnail: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  members: ProjectMember[];
}

function mapProject(row: ProjectRow): ProjectResponse {
  const tags = tagsByProjectStmt.all(row.id).map((item) => item.name);
  const members = membersByProjectStmt.all(row.id).map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
  }));

  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    description: row.description,
    category: row.category,
    course: row.course,
    status: row.status,
    shift: row.shift,
    class: row.class,
    semester: row.semester,
    professor: row.professor,
    author: row.author,
    authorEmail: row.author_email,
    projectUrl: row.project_url,
    githubUrl: row.github_url,
    youtubeUrl: row.youtube_url,
    thumbnail: row.thumbnail,
    views: row.views,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tags,
    members,
  };
}

function normalizeTag(tag: string): string | null {
  const normalized = tag.trim();
  return normalized.length ? normalized : null;
}

const createProjectTransaction = db.transaction((input: CreateProjectInput) => {
  const now = new Date().toISOString();
  const payload = {
    ...input,
    created_at: now,
    updated_at: now,
    status: "Em Revisão" as ProjectStatus,
  };

  const { lastInsertRowid } = insertProjectStmt.run(payload);
  const projectId = Number(lastInsertRowid);

  if (input.members?.length) {
    input.members.forEach((member) => {
      if (!member?.name?.trim()) return;
      insertMemberStmt.run({
        projectId,
        name: member.name.trim(),
        role: member.role?.trim() ?? null,
      });
    });
  }

  if (input.tags?.length) {
    input.tags.forEach((tag) => {
      const normalized = tag ? normalizeTag(tag) : null;
      if (!normalized) return;

      const existing = findTagIdStmt.get(normalized);
      const tagId =
        existing?.id ?? Number(insertTagStmt.run(normalized).lastInsertRowid);

      linkTagToProjectStmt.run({ projectId, tagId });
    });
  }

  return projectId;
});

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Projeplac API is running" });
});

app.get("/projects", (req, res) => {
  const { status, course, category, shift, tag, search, sort } = req.query;

  const filters: string[] = [];
  const params: Record<string, unknown> = {};

  if (status && typeof status === "string") {
    filters.push("status = @status");
    params.status = status;
  }

  if (course && typeof course === "string") {
    filters.push("course = @course");
    params.course = course;
  }

  if (category && typeof category === "string") {
    filters.push("category = @category");
    params.category = category;
  }

  if (shift && typeof shift === "string") {
    filters.push("shift = @shift");
    params.shift = shift;
  }

  if (tag && typeof tag === "string") {
    filters.push(`
      id IN (
        SELECT pt.project_id
        FROM project_tags pt
        INNER JOIN tags t ON t.id = pt.tag_id
        WHERE t.name = @tag
      )
    `);
    params.tag = tag;
  }

  if (search && typeof search === "string") {
    filters.push(`
      (
        title LIKE @search OR
        summary LIKE @search OR
        description LIKE @search OR
        author LIKE @search OR
        professor LIKE @search
      )
    `);
    params.search = `%${search}%`;
  }

  let query = `
    SELECT
      id,
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
      views,
      created_at,
      updated_at
    FROM projects
  `;

  if (filters.length) {
    query += ` WHERE ${filters.join(" AND ")}`;
  }

  const orderBy =
    sort === "oldest"
      ? "created_at ASC"
      : sort === "popular"
      ? "views DESC"
      : "created_at DESC";

  query += ` ORDER BY ${orderBy}`;

  const rows = db.prepare(query).all(params) as ProjectRow[];
  const projects = rows.map(mapProject);

  res.json(projects);
});

app.get("/projects/:id", (req, res) => {
  const projectId = Number(req.params.id);

  if (Number.isNaN(projectId)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const row = projectByIdStmt.get(projectId);

  if (!row) {
    return res.status(404).json({ error: "Projeto não encontrado" });
  }

  res.json(mapProject(row));
});

app.post("/projects", (req, res) => {
  const payload = req.body as CreateProjectInput;

  if (!payload?.title?.trim()) {
    return res
      .status(400)
      .json({ error: "Campo obrigatório: title" });
  }

  try {
    const projectId = createProjectTransaction({
      ...payload,
      title: payload.title.trim(),
      summary: payload.summary?.trim(),
      description: payload.description?.trim(),
      category: payload.category?.trim(),
      course: payload.course?.trim(),
      shift: payload.shift?.trim(),
      class: payload.class?.trim(),
      semester: payload.semester?.trim(),
      professor: payload.professor?.trim(),
      author: payload.author?.trim(),
      authorEmail: payload.authorEmail?.trim(),
      projectUrl: payload.projectUrl?.trim(),
      githubUrl: payload.githubUrl?.trim(),
      youtubeUrl: payload.youtubeUrl?.trim(),
      thumbnail: payload.thumbnail?.trim(),
      tags: payload.tags,
      members: payload.members,
    });

    const row = projectByIdStmt.get(projectId);
    if (!row) {
      return res.status(201).json({ id: projectId });
    }

    res.status(201).json(mapProject(row));
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    res.status(500).json({ error: "Não foi possível criar o projeto" });
  }
});

app.patch("/projects/:id/status", (req, res) => {
  const projectId = Number(req.params.id);
  const { status } = req.body as { status?: ProjectStatus };

  if (Number.isNaN(projectId)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const validStatuses: ProjectStatus[] = [
    "Em Revisão",
    "Em Andamento",
    "Publicado",
  ];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Status inválido. Valores aceitos: ${validStatuses.join(", ")}`,
    });
  }

  const result = updateProjectStatusStmt.run({ id: projectId, status });

  if (result.changes === 0) {
    return res.status(404).json({ error: "Projeto não encontrado" });
  }

  const updatedProject = projectByIdStmt.get(projectId);
  if (!updatedProject) {
    return res.status(404).json({ error: "Projeto não encontrado" });
  }

  res.json(mapProject(updatedProject));
});

app.get("/stats", (_req, res) => {
  const summary = db
    .prepare(
      `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Publicado' THEN 1 ELSE 0 END) AS published,
        SUM(CASE WHEN status = 'Em Revisão' THEN 1 ELSE 0 END) AS in_review,
        SUM(CASE WHEN status = 'Em Andamento' THEN 1 ELSE 0 END) AS in_progress
      FROM projects
    `
    )
    .get() as {
    total: number;
    published: number;
    in_review: number;
    in_progress: number;
  };

  const byCourse = db
    .prepare(
      `
      SELECT
        course,
        COUNT(*) AS total
      FROM projects
      WHERE course IS NOT NULL AND course <> ''
      GROUP BY course
      ORDER BY total DESC
    `
    )
    .all() as Array<{ course: string; total: number }>;

  const latestProjects = db
    .prepare(
      `
      SELECT
        id,
        title,
        author,
        status,
        created_at
      FROM projects
      ORDER BY created_at DESC
      LIMIT 5
    `
    )
    .all();

  res.json({
    summary: {
      total: summary.total ?? 0,
      published: summary.published ?? 0,
      inReview: summary.in_review ?? 0,
      inProgress: summary.in_progress ?? 0,
    },
    byCourse,
    latestProjects,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `Rota ${req.path} não encontrada` });
});

app.listen(Number(PORT), () => {
  console.log(`API on http://localhost:${PORT}`);
});
