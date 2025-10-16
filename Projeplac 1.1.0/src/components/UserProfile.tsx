import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ProfileIcon } from "./ProfileIcon";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Edit, 
  Save, 
  X,
  Camera,
  Building,
  BookOpen
} from "lucide-react";
import { useState } from "react";

interface UserProfileProps {
  onBack: () => void;
}

// Mock user data - em um app real, isso viria de uma API
const mockUserData = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@estudante.uniceplac.edu.br",
  phone: "(61) 99999-9999",
  ra: "24686",
  course: "Engenharia de Software",
  semester: "8º Semestre",
  shift: "Noturno",
  class: "ES-2024-2",
  birthDate: "1995-03-15",
  city: "Gama, DF",
  bio: "Estudante de Engenharia de Software apaixonado por desenvolvimento web e tecnologias emergentes. Experiência em React, Node.js e Python.",
  avatar: "",
  enrollmentDate: "2021-02-01",
  status: "Ativo",
  totalProjects: 3,
  completedProjects: 2,
  userType: "aluno" as "aluno" | "professor"
};

export function UserProfile({ onBack }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [formData, setFormData] = useState(mockUserData);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
    // TODO: Aqui seria feita a chamada para API para salvar os dados
    console.log('Dados salvos:', formData);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header da Página */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Meu Perfil</h1>
              <p className="text-muted-foreground">
                Gerencie suas informações pessoais e acadêmicas
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar - Foto e Informações Básicas */}
          <div className="space-y-6">
            
            {/* Avatar e Nome */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                        {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Badge de tipo de perfil */}
                    <div className="absolute -top-1 -right-1">
                      <ProfileIcon type={userData.userType} size="md" />
                    </div>
                    {isEditing && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold text-foreground">{userData.name}</h3>
                      <Badge variant={userData.userType === "professor" ? "secondary" : "default"} className="text-xs">
                        {userData.userType === "professor" ? "Professor" : "Aluno"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{userData.course}</p>
                    <Badge variant="outline" className="mt-2 text-primary border-primary">
                      {userData.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total de Projetos</span>
                  <Badge variant="secondary">{userData.totalProjects}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Projetos Concluídos</span>
                  <Badge className="bg-green-500 text-white">{userData.completedProjects}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Matrícula desde</span>
                  <span className="text-sm text-foreground">
                    {new Date(userData.enrollmentDate).getFullYear()}
                  </span>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Conteúdo Principal - Formulário */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Dados pessoais e informações de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={isEditing ? formData.name : userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Institucional</Label>
                    <Input
                      id="email"
                      type="email"
                      value={isEditing ? formData.email : userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={isEditing ? formData.phone : userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={isEditing ? formData.birthDate : userData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={isEditing ? formData.city : userData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={isEditing ? formData.bio : userData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-muted' : ''}
                    rows={3}
                    placeholder="Conte um pouco sobre você, seus interesses e objetivos acadêmicos..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informações Acadêmicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  Informações Acadêmicas
                </CardTitle>
                <CardDescription>
                  Dados relacionados ao seu curso na UNICEPLAC
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ra">RA (Registro Acadêmico)</Label>
                    <Input
                      id="ra"
                      value={userData.ra}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      O RA não pode ser alterado
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course">Curso</Label>
                    {isEditing ? (
                      <Select 
                        value={formData.course} 
                        onValueChange={(value) => handleInputChange('course', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o curso" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engenharia de Software">Engenharia de Software</SelectItem>
                          <SelectItem value="Análise e Desenvolvimento de Sistemas">Análise e Desenvolvimento de Sistemas</SelectItem>
                          <SelectItem value="Ciência da Computação">Ciência da Computação</SelectItem>
                          <SelectItem value="Sistemas de Informação">Sistemas de Informação</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={userData.course}
                        disabled
                        className="bg-muted"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semestre Atual</Label>
                    {isEditing ? (
                      <Select 
                        value={formData.semester} 
                        onValueChange={(value) => handleInputChange('semester', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o semestre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1º Semestre">1º Semestre</SelectItem>
                          <SelectItem value="2º Semestre">2º Semestre</SelectItem>
                          <SelectItem value="3º Semestre">3º Semestre</SelectItem>
                          <SelectItem value="4º Semestre">4º Semestre</SelectItem>
                          <SelectItem value="5º Semestre">5º Semestre</SelectItem>
                          <SelectItem value="6º Semestre">6º Semestre</SelectItem>
                          <SelectItem value="7º Semestre">7º Semestre</SelectItem>
                          <SelectItem value="8º Semestre">8º Semestre</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={userData.semester}
                        disabled
                        className="bg-muted"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shift">Turno</Label>
                    {isEditing ? (
                      <Select 
                        value={formData.shift} 
                        onValueChange={(value) => handleInputChange('shift', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o turno" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Matutino">Matutino</SelectItem>
                          <SelectItem value="Vespertino">Vespertino</SelectItem>
                          <SelectItem value="Noturno">Noturno</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={userData.shift}
                        disabled
                        className="bg-muted"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="class">Turma</Label>
                    <Input
                      id="class"
                      value={isEditing ? formData.class : userData.class}
                      onChange={(e) => handleInputChange('class', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentDate">Data de Matrícula</Label>
                    <Input
                      id="enrollmentDate"
                      type="date"
                      value={userData.enrollmentDate}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      A data de matrícula não pode ser alterada
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}