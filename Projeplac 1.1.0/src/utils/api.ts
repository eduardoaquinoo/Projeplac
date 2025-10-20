const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3333";

export type ProjectStatus = "Em Revisão" | "Em Andamento" | "Publicado";

export interface ProjectMember {
  id: number;
  name: string;
  role: string | null;
}

export interface Project {
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

export interface ProjectPayload {
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
  members?: Array<{ name: string; role?: string }>;
}

export interface ProjectsFilters {
  status?: ProjectStatus | "all";
  course?: string;
  category?: string;
  shift?: string;
  tag?: string;
  search?: string;
  sort?: "newest" | "oldest" | "popular";
}

export interface StatsSummary {
  total: number;
  published: number;
  inReview: number;
  inProgress: number;
}

export interface StatsResponse {
  summary: StatsSummary;
  byCourse: Array<{ course: string; total: number }>;
  latestProjects: Array<{
    id: number;
    title: string;
    author: string | null;
    status: ProjectStatus;
    created_at: string;
  }>;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(message.error ?? "Erro na requisição");
  }

  return response.json() as Promise<T>;
}

function buildQuery(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "all") {
      searchParams.append(key, value);
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const api = {
  listProjects(filters: ProjectsFilters = {}) {
    const query = buildQuery({
      status: filters.status,
      course: filters.course,
      category: filters.category,
      shift: filters.shift,
      tag: filters.tag,
      search: filters.search,
      sort: filters.sort,
    });
    return request<Project[]>(`/projects${query}`);
  },

  getProject(id: number) {
    return request<Project>(`/projects/${id}`);
  },

  createProject(payload: ProjectPayload) {
    return request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateProjectStatus(id: number, status: ProjectStatus) {
    return request<Project>(`/projects/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  getStats() {
    return request<StatsResponse>("/stats");
  },
};
