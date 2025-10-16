// Gerenciador de likes e destaques dos projetos

interface ProjectLikes {
  [projectId: number]: number;
}

interface UserLikes {
  [projectId: number]: boolean;
}

interface FeaturedProjects {
  manual: number[];
  auto: number[];
}

const STORAGE_KEYS = {
  PROJECT_LIKES: 'projeplac_project_likes',
  USER_LIKES: 'projeplac_user_likes',
  FEATURED_PROJECTS: 'projeplac_featured_projects'
};

// Gerenciar likes dos projetos
export function getProjectLikes(): ProjectLikes {
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECT_LIKES);
  return stored ? JSON.parse(stored) : {};
}

export function setProjectLikes(likes: ProjectLikes): void {
  localStorage.setItem(STORAGE_KEYS.PROJECT_LIKES, JSON.stringify(likes));
}

export function getLikesCount(projectId: number): number {
  const likes = getProjectLikes();
  return likes[projectId] || 0;
}

export function incrementLikes(projectId: number): number {
  const likes = getProjectLikes();
  likes[projectId] = (likes[projectId] || 0) + 1;
  setProjectLikes(likes);
  return likes[projectId];
}

export function decrementLikes(projectId: number): number {
  const likes = getProjectLikes();
  likes[projectId] = Math.max(0, (likes[projectId] || 0) - 1);
  setProjectLikes(likes);
  return likes[projectId];
}

// Gerenciar likes do usuário
export function getUserLikes(): UserLikes {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_LIKES);
  return stored ? JSON.parse(stored) : {};
}

export function setUserLikes(userLikes: UserLikes): void {
  localStorage.setItem(STORAGE_KEYS.USER_LIKES, JSON.stringify(userLikes));
}

export function hasUserLiked(projectId: number): boolean {
  const userLikes = getUserLikes();
  return !!userLikes[projectId];
}

export function toggleLike(projectId: number): { liked: boolean; count: number } {
  const userLikes = getUserLikes();
  const wasLiked = !!userLikes[projectId];
  
  if (wasLiked) {
    delete userLikes[projectId];
    const count = decrementLikes(projectId);
    setUserLikes(userLikes);
    return { liked: false, count };
  } else {
    userLikes[projectId] = true;
    const count = incrementLikes(projectId);
    setUserLikes(userLikes);
    return { liked: true, count };
  }
}

// Gerenciar projetos em destaque
export function getFeaturedProjects(): FeaturedProjects {
  const stored = localStorage.getItem(STORAGE_KEYS.FEATURED_PROJECTS);
  return stored ? JSON.parse(stored) : { manual: [], auto: [] };
}

export function setFeaturedProjects(featured: FeaturedProjects): void {
  localStorage.setItem(STORAGE_KEYS.FEATURED_PROJECTS, JSON.stringify(featured));
}

export function getManualFeatured(): number[] {
  return getFeaturedProjects().manual;
}

export function setManualFeatured(projectIds: number[]): void {
  const featured = getFeaturedProjects();
  featured.manual = projectIds;
  setFeaturedProjects(featured);
}

export function toggleManualFeatured(projectId: number): boolean {
  const featured = getFeaturedProjects();
  const index = featured.manual.indexOf(projectId);
  
  if (index > -1) {
    featured.manual.splice(index, 1);
    setFeaturedProjects(featured);
    return false;
  } else {
    featured.manual.push(projectId);
    setFeaturedProjects(featured);
    return true;
  }
}

export function isManualFeatured(projectId: number): boolean {
  const manual = getManualFeatured();
  return manual.includes(projectId);
}

// Obter projetos mais curtidos automaticamente
export function getTopLikedProjects(count: number = 3): number[] {
  const likes = getProjectLikes();
  const sorted = Object.entries(likes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([id]) => parseInt(id));
  
  return sorted;
}

// Obter lista combinada de destaques (manual + automático)
// Retorna sempre o número especificado de projetos (padrão: 6)
export function getCombinedFeatured(maxCount: number = 6, allProjectIds: number[] = []): number[] {
  const manual = getManualFeatured();
  const topLiked = getTopLikedProjects(15); // Pega mais do que precisa
  
  // Combina manual primeiro, depois os mais curtidos que não estão na lista manual
  const combined = [...manual];
  
  // Adiciona projetos com mais curtidas
  for (const projectId of topLiked) {
    if (!combined.includes(projectId) && combined.length < maxCount) {
      combined.push(projectId);
    }
  }
  
  // Se ainda não tiver 6 projetos, preenche com projetos disponíveis
  if (combined.length < maxCount && allProjectIds.length > 0) {
    for (const projectId of allProjectIds) {
      if (!combined.includes(projectId) && combined.length < maxCount) {
        combined.push(projectId);
      }
    }
  }
  
  return combined.slice(0, maxCount);
}
