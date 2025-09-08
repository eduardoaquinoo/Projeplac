import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    category: string;
    technologies: string[];
    stars: number;
    forks: number;
    author: string;
    lastUpdate: string;
    icon: string;
    status: 'Ativo' | 'Concluído' | 'Em Desenvolvimento';
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Concluído':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Em Desenvolvimento':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Web Development':
        return 'fa-globe';
      case 'Mobile App':
        return 'fa-mobile-alt';
      case 'Desktop App':
        return 'fa-desktop';
      case 'API':
        return 'fa-server';
      case 'Machine Learning':
        return 'fa-brain';
      case 'DevOps':
        return 'fa-cogs';
      default:
        return 'fa-code';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-green-300 h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-orange-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <i className={`fas ${project.icon} text-white text-lg`}></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                {project.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <i className={`fas ${getCategoryIcon(project.category)} mr-1`}></i>
                {project.category}
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <i className="fas fa-star text-yellow-500"></i>
              <span>{project.stars}</span>
            </div>
            <div className="flex items-center space-x-1">
              <i className="fas fa-code-branch text-gray-400"></i>
              <span>{project.forks}</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Por {project.author}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Atualizado {project.lastUpdate}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" className="text-gray-600 hover:text-green-600">
            <i className="fas fa-eye mr-1"></i>
            Ver
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-green-600 to-orange-500 text-white hover:from-green-700 hover:to-orange-600">
            <i className="fas fa-external-link-alt mr-1"></i>
            Abrir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}