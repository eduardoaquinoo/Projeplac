import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, UserPlus, User, GraduationCap, Clock, Calendar, Lock, Mail, Phone, BookOpen, Briefcase } from "lucide-react";
import { useState } from "react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

interface RegisterProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

export function Register({ onBack, onRegisterSuccess }: RegisterProps) {
  const [formData, setFormData] = useState({
    userType: "",
    name: "",
    ra: "",
    email: "",
    phone: "",
    shift: "",
    course: "",
    semester: "",
    birthDate: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const shifts = [
    { value: "matutino", label: "Matutino" },
    { value: "vespertino", label: "Vespertino" },
    { value: "noturno", label: "Noturno" }
  ];

  const courses = [
    { value: "engenharia-software", label: "Engenharia de Software" },
    { value: "analise-desenvolvimento", label: "Análise e Desenvolvimento de Sistemas" },
    { value: "ciencia-computacao", label: "Ciência da Computação" },
    { value: "sistemas-informacao", label: "Sistemas de Informação" }
  ];

  const semesters = [
    { value: "primeiro", label: "Primeiro" },
    { value: "segundo", label: "Segundo" },
    { value: "terceiro", label: "Terceiro" },
    { value: "quarto", label: "Quarto" },
    { value: "quinto", label: "Quinto" },
    { value: "sexto", label: "Sexto" },
    { value: "setimo", label: "Sétimo" },
    { value: "oitavo", label: "Oitavo" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpa erro quando usuário começa a digitar
    if (error) setError("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    // Verifica se tem 10 ou 11 dígitos (formato brasileiro)
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  };

  const validateForm = () => {
    if (!formData.userType) {
      setError("Tipo de perfil é obrigatório");
      return false;
    }
    if (!formData.name.trim()) {
      setError("Nome é obrigatório");
      return false;
    }
    // RA é obrigatório apenas para alunos
    if (formData.userType === "aluno" && !formData.ra.trim()) {
      setError("RA é obrigatório para alunos");
      return false;
    }
    if (!formData.email.trim()) {
      setError("E-mail é obrigatório");
      return false;
    }
    if (!validateEmail(formData.email)) {
      setError("E-mail deve ter um formato válido");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Número de celular é obrigatório");
      return false;
    }
    if (!validatePhone(formData.phone)) {
      setError("Número de celular deve ter 10 ou 11 dígitos");
      return false;
    }
    // Campos específicos de alunos
    if (formData.userType === "aluno") {
      if (!formData.shift) {
        setError("Turno é obrigatório para alunos");
        return false;
      }
      if (!formData.course) {
        setError("Curso é obrigatório para alunos");
        return false;
      }
      if (!formData.semester) {
        setError("Semestre é obrigatório para alunos");
        return false;
      }
    }
    if (!formData.birthDate) {
      setError("Data de nascimento é obrigatória");
      return false;
    }
    if (!formData.password) {
      setError("Senha é obrigatória");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Senhas não coincidem");
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Busca usuários existentes
      const storedUsers = localStorage.getItem('registeredUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Verifica se email ou RA já existe
      const emailExists = users.some((u: any) => u.email === formData.email);
      if (emailExists) {
        setError("E-mail já cadastrado");
        setIsLoading(false);
        return;
      }

      if (formData.userType === "aluno") {
        const raExists = users.some((u: any) => u.ra === formData.ra);
        if (raExists) {
          setError("RA já cadastrado");
          setIsLoading(false);
          return;
        }
      }

      // Adiciona novo usuário
      const newUser = {
        id: Date.now(),
        userType: formData.userType,
        name: formData.name,
        ra: formData.ra,
        email: formData.email,
        phone: formData.phone,
        shift: formData.shift,
        course: formData.course,
        semester: formData.semester,
        birthDate: formData.birthDate,
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));

      alert("Cadastro realizado com sucesso! Você pode fazer login agora.");
      onRegisterSuccess();
    } catch (err) {
      console.error('Erro ao processar cadastro:', err);
      setError('Erro ao processar cadastro. Tente novamente.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header da página */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center space-x-2 text-primary hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <div className="flex items-center space-x-3">
                <img 
                  src={projeplacLogo} 
                  alt="Projeplac Logo" 
                  className="h-10 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold">
                    <span className="text-primary">Proje</span>
                    <span className="text-secondary">plac</span>
                  </h1>
                  <p className="text-sm text-muted-foreground">Criar nova conta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Criar Nova Conta
          </h2>
          <p className="text-muted-foreground">
            Junte-se à comunidade acadêmica da UNICEPLAC
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-primary">Cadastro no Projeplac</CardTitle>
            <CardDescription>
              Preencha suas informações para criar uma conta no Projeplac
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Tipo de Perfil */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>Tipo de Perfil</span>
                </Label>
                <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
                  <SelectTrigger className="bg-input-background border-border focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Selecione o tipo de perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluno">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>Aluno</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="professor">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Professor</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Selecione se você é aluno ou professor da UNICEPLAC
                </p>
              </div>

              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground flex items-center space-x-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>Nome Completo</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* RA - apenas para alunos */}
              {formData.userType === "aluno" && (
                <div className="space-y-2">
                  <Label htmlFor="ra" className="text-foreground flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>RA (Registro Acadêmico)</span>
                  </Label>
                  <Input
                    id="ra"
                    type="text"
                    placeholder="Digite seu RA"
                    value={formData.ra}
                    onChange={(e) => handleInputChange("ra", e.target.value)}
                    className="bg-input-background border-border focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              )}

              {/* E-mail */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>E-mail</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Número de Celular */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>Número de Celular</span>
                </Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Digite seu número de celular"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Campos específicos para alunos */}
              {formData.userType === "aluno" && (
                <>
                  {/* Grid para Turno e Curso */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Turno */}
                    <div className="space-y-2">
                      <Label className="text-foreground flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Turno</span>
                      </Label>
                      <Select value={formData.shift} onValueChange={(value) => handleInputChange("shift", value)}>
                        <SelectTrigger className="bg-input-background border-border focus:border-primary focus:ring-primary">
                          <SelectValue placeholder="Selecione o turno" />
                        </SelectTrigger>
                        <SelectContent>
                          {shifts.map((shift) => (
                            <SelectItem key={shift.value} value={shift.value}>
                              {shift.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Curso */}
                    <div className="space-y-2">
                      <Label className="text-foreground flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span>Curso</span>
                      </Label>
                      <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                        <SelectTrigger className="bg-input-background border-border focus:border-primary focus:ring-primary">
                          <SelectValue placeholder="Selecione o curso" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.value} value={course.value}>
                              {course.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Grid para Semestre */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Semestre */}
                    <div className="space-y-2">
                      <Label className="text-foreground flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>Semestre</span>
                      </Label>
                      <Select value={formData.semester} onValueChange={(value) => handleInputChange("semester", value)}>
                        <SelectTrigger className="bg-input-background border-border focus:border-primary focus:ring-primary">
                          <SelectValue placeholder="Selecione o semestre" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((semester) => (
                            <SelectItem key={semester.value} value={semester.value}>
                              {semester.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-foreground flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Data de Nascimento</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  min="1940-01-01"
                  max="2010-12-31"
                  required
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>Senha</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Mínimo de 6 caracteres
                </p>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>Confirmar Senha</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Botão de Cadastro */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Criando conta...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Criar Conta</span>
                  </span>
                )}
              </Button>

              {/* Link para voltar ao login */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={onBack}
                >
                  Já tem uma conta? Fazer login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="mt-8 p-6 bg-accent rounded-lg border border-accent-foreground/20">
          <h3 className="font-semibold text-accent-foreground mb-2">
            Sobre o Projeplac
          </h3>
          <ul className="text-sm text-accent-foreground/80 space-y-1">
            <li>• Portal exclusivo para alunos e professores da UNICEPLAC</li>
            <li>• Compartilhe seus projetos acadêmicos</li>
            <li>• Conecte-se com outros estudantes e professores</li>
            <li>• Explore projetos dos diferentes cursos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
