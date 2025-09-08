import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

const dashboardData = {
  overview: {
    totalProjects: 500,
    activeProjects: 342,
    completedProjects: 158,
    totalDevelopers: 1240,
    totalTechnologies: 52,
    monthlyGrowth: 23.5
  },
  topTechnologies: [
    { name: 'React', count: 145, percentage: 29 },
    { name: 'Node.js', count: 128, percentage: 26 },
    { name: 'Python', count: 98, percentage: 20 },
    { name: 'TypeScript', count: 87, percentage: 17 },
    { name: 'Docker', count: 76, percentage: 15 },
  ],
  projectsByCategory: [
    { category: 'Web Development', count: 185, color: 'bg-green-500' },
    { category: 'Mobile App', count: 142, color: 'bg-orange-500' },
    { category: 'API', count: 98, color: 'bg-blue-500' },
    { category: 'Machine Learning', count: 45, color: 'bg-purple-500' },
    { category: 'DevOps', count: 30, color: 'bg-red-500' },
  ],
  recentActivity: [
    { action: 'Novo projeto criado', project: 'Sistema de E-commerce', user: 'João Silva', time: '2 min atrás' },
    { action: 'Projeto atualizado', project: 'App Mobile Fitness', user: 'Maria Santos', time: '15 min atrás' },
    { action: 'Fork realizado', project: 'API Gateway', user: 'Pedro Costa', time: '1h atrás' },
    { action: 'Estrela adicionada', project: 'Dashboard Analytics', user: 'Ana Oliveira', time: '2h atrás' },
  ]
};

export function Dashboard() {
  const { overview, topTechnologies, projectsByCategory, recentActivity } = dashboardData;

  return (
    <section id="dashboard" className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div data-aos="fade-up" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
              Dashboard
            </span>{' '}
            de Estatísticas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acompanhe o crescimento e a evolução da nossa comunidade de desenvolvedores
          </p>
        </div>

        {/* Overview Cards */}
        <div data-aos="fade-up" data-aos-delay="100" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Projetos</CardTitle>
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-folder text-white text-sm"></i>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{overview.totalProjects}</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <i className="fas fa-arrow-up mr-1"></i>
                +{overview.monthlyGrowth}% este mês
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Projetos Ativos</CardTitle>
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-rocket text-white text-sm"></i>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{overview.activeProjects}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round((overview.activeProjects / overview.totalProjects) * 100)}% do total
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Desenvolvedores</CardTitle>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-white text-sm"></i>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{overview.totalDevelopers.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">
                Comunidade ativa
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tecnologias</CardTitle>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-code text-white text-sm"></i>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{overview.totalTechnologies}</div>
              <div className="text-sm text-gray-500 mt-1">
                Linguagens e frameworks
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Technologies */}
          <Card data-aos="fade-up" data-aos-delay="200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-trophy text-yellow-500 mr-2"></i>
                Top Tecnologias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topTechnologies.map((tech, index) => (
                <div key={tech.name} className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-400 to-orange-400 rounded-lg text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{tech.name}</span>
                      <span className="text-sm text-gray-500">{tech.count} projetos</span>
                    </div>
                    <Progress value={tech.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Projects by Category */}
          <Card data-aos="fade-up" data-aos-delay="300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-chart-pie text-green-500 mr-2"></i>
                Projetos por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectsByCategory.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    <span className="font-medium text-gray-900">{category.category}</span>
                  </div>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card data-aos="fade-up" data-aos-delay="400">
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-clock text-orange-500 mr-2"></i>
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{activity.action}</span>
                      <Badge variant="outline" className="text-xs">
                        {activity.project}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>por {activity.user}</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}