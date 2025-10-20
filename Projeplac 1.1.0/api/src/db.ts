import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const databasePath = path.resolve(__dirname, "../projeplac.db");

const db = new Database(databasePath);
db.pragma("foreign_keys = ON");

const schema = `
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  category TEXT,
  course TEXT,
  status TEXT NOT NULL DEFAULT 'Em Revisão',
  shift TEXT,
  class TEXT,
  semester TEXT,
  professor TEXT,
  author TEXT,
  author_email TEXT,
  project_url TEXT,
  github_url TEXT,
  youtube_url TEXT,
  thumbnail TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS project_tags (
  project_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (project_id, tag_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
`;

db.exec(schema);

export type ProjectStatus = "Em Revisão" | "Em Andamento" | "Publicado";

export interface ProjectRow {
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
  author_email: string | null;
  project_url: string | null;
  github_url: string | null;
  youtube_url: string | null;
  thumbnail: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  title: string;
  summary?: string;
  description?: string;
  category?: string;
  course?: string;
  shift?: string;
  class?: string;
  semester?: string;
  professor?: string;
  author?: string;
  authorEmail?: string;
  projectUrl?: string;
  githubUrl?: string;
  youtubeUrl?: string;
  thumbnail?: string;
  tags?: string[];
  members?: Array<{
    name: string;
    role?: string;
  }>;
}

export { db };
