import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, LogIn, UserPlus, User, Lock } from "lucide-react";
import { useState } from "react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

interface LoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
  onAdminLoginSuccess: () => void;
}

export function Login({ onBack, onLoginSuccess, onNavigateToRegister, onAdminLoginSuccess }: LoginProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpa erro quando usuário começa a digitar
    if (error) setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Verifica se é o usuário admin padrão
      if (formData.username.toLowerCase() === "admin" && formData.password === "admin") {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
          username: 'admin',
          name: 'Administrador',
          email: 'admin@projeplac.com',
          userType: 'admin'
        }));
        alert("Login de administrador realizado com sucesso!");
        onAdminLoginSuccess();
        setIsLoading(false);
        return;
      }

      // Verifica se é um admin criado dinamicamente
      const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      const adminUser = adminUsers.find((admin: any) => 
        admin.email === formData.username && admin.password === formData.password
      );

      if (adminUser) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
          username: adminUser.email,
          name: adminUser.name,
          email: adminUser.email,
          userType: 'admin'
        }));
        alert(`Login de administrador realizado com sucesso! Bem-vindo, ${adminUser.name}!`);
        onAdminLoginSuccess();
        setIsLoading(false);
        return;
      }

      // Busca usuários registrados do localStorage
      const storedUsers = localStorage.getItem('registeredUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Verifica se é o usuário teste padrão
      if (formData.username === "24686" && formData.password === "123456") {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
          username: '24686',
          name: 'João Silva',
          email: 'joao.silva@estudante.uniceplac.edu.br',
          ra: '24686',
          userType: 'aluno',
          course: 'Engenharia de Software',
          semester: 'oitavo',
          shift: 'noturno'
        }));
        alert("Login realizado com sucesso!");
        onLoginSuccess();
        setIsLoading(false);
        return;
      }

      // Verifica credenciais nos usuários registrados
      const user = users.find((u: any) => 
        (u.ra === formData.username || u.email === formData.username) && 
        u.password === formData.password
      );

      if (user) {
        // Remove a senha antes de salvar no localStorage
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        alert("Login realizado com sucesso!");
        onLoginSuccess();
        setIsLoading(false);
        return;
      }

      setError("Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.");
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError("Erro ao processar login. Tente novamente.");
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
                  <p className="text-sm text-muted-foreground">Entrar na sua conta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Entrar no Projeplac
          </h2>
          <p className="text-muted-foreground">
            Acesse sua conta para gerenciar seus projetos acadêmicos
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-primary">Fazer Login</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Campo de Usuário/RA */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground flex items-center space-x-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>Usuário/RA</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu RA ou usuário"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Campo de Senha */}
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
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Entrando...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Entrar</span>
                  </span>
                )}
              </Button>

              {/* Link para esqueci senha */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => alert("Funcionalidade em desenvolvimento. Entre em contato com a administração.")}
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Seção para criar conta */}
        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-muted-foreground">Não tem uma conta?</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={onNavigateToRegister}
            className="mt-4 w-full border-secondary text-secondary hover:bg-secondary hover:text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Criar nova conta
          </Button>
        </div>

        {/* Informações de teste */}
        <div className="mt-8 p-4 bg-accent rounded-lg border border-accent-foreground/20">
          <h3 className="font-semibold text-accent-foreground mb-2">
            Contas de Teste
          </h3>
          <div className="text-sm text-accent-foreground/80 space-y-2">
            <div>
              <p><strong>Aluno/Professor:</strong></p>
              <p><strong>RA:</strong> 24686</p>
              <p><strong>Senha:</strong> 123456</p>
            </div>
            <div className="pt-2 border-t border-accent-foreground/20">
              <p><strong>Administrador:</strong></p>
              <p><strong>Usuário:</strong> admin</p>
              <p><strong>Senha:</strong> admin</p>
            </div>
            <p className="text-xs mt-2 text-accent-foreground/60">
              Use estas credenciais para testar o sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
