import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';

interface NewProjectFormProps {
  onProjectAdded: (project: any) => void;
  onCancel: () => void;
}

const categoryIcons = {
  'Web Development': 'fa-globe',
  'Mobile App': 'fa-mobile-alt',
  'Desktop App': 'fa-desktop',
  'API': 'fa-server',
  'Machine Learning': 'fa-brain',
  'DevOps': 'fa-cogs'
};

const availableTechnologies = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'TypeScript', 
  'JavaScript', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'MySQL', 
  'Redis', 'AWS', 'Azure', 'GCP', 'Firebase', 'GraphQL', 'REST API', 'TensorFlow',
  'Scikit-learn', 'Flask', 'Django', 'Express.js', 'Spring Boot', 'ASP.NET',
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Electron', 'Unity'
];

export function NewProjectForm({ onProjectAdded, onCancel }: NewProjectFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technologies: [] as string[],
    status: 'Em Desenvolvimento' as const
  });
  const [techInput, setTechInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTechAdd = (tech: string) => {
    if (tech && !formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
      setTechInput('');
    }
  };

  const handleTechRemove = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newProject = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      technologies: formData.technologies,
      stars: 0,
      forks: 0,
      author: user?.username || 'Usuário',
      lastUpdate: 'agora',
      icon: categoryIcons[formData.category as keyof typeof categoryIcons] || 'fa-code',
      status: formData.status
    };

    onProjectAdded(newProject);
    setSuccess(true);
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setFormData({
        title: '',
        description: '',
        category: '',
        technologies: [],
        status: 'Em Desenvolvimento'
      });
      setSuccess(false);
      onCancel();
    }, 2000);
  };

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-check text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Projeto Criado com Sucesso!</h3>
            <p className="text-gray-600">Seu projeto foi adicionado ao repositório e estará visível em breve.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <i className="fas fa-plus-circle text-green-600 mr-2"></i>
          Novo Projeto
        </CardTitle>
        <CardDescription>
          Adicione um novo projeto ao repositório Projeplac
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título do Projeto *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Sistema de E-commerce Moderno"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o objetivo, funcionalidades principais e características do seu projeto..."
              required
              disabled={isSubmitting}
              rows={4}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Categoria *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(categoryIcons).map((category) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center">
                      <i className={`fas ${categoryIcons[category as keyof typeof categoryIcons]} mr-2`}></i>
                      {category}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <Label>Tecnologias Utilizadas</Label>
            <div className="space-y-3">
              <Select 
                value={techInput} 
                onValueChange={(value) => {
                  handleTechAdd(value);
                  setTechInput('');
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Adicionar tecnologia" />
                </SelectTrigger>
                <SelectContent>
                  {availableTechnologies
                    .filter(tech => !formData.technologies.includes(tech))
                    .map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary" 
                      className="pr-1 flex items-center gap-1"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleTechRemove(tech)}
                        className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status do Projeto</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Em Desenvolvimento">Em Desenvolvimento</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              <i className="fas fa-times mr-2"></i>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.description || !formData.category}
              className="flex-1 bg-gradient-to-r from-green-600 to-orange-500 text-white hover:from-green-700 hover:to-orange-600"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Criando...
                </>
              ) : (
                <>
                  <i className="fas fa-plus mr-2"></i>
                  Criar Projeto
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}