import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowLeft, Shield, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import projeplacLogo from "figma:asset/b3251cf511c1d97994f8e9f326025eaf4de9bd06.png";

interface CreateAdminProps {
  onBack: () => void;
}

interface AdminUser {
  email: string;
  password: string;
  name: string;
  createdAt: string;
  createdBy: string;
}

export function CreateAdmin({ onBack }: CreateAdminProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Por favor, insira o nome do administrador.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Por favor, insira o email.");
      return false;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um email válido.");
      return false;
    }

    if (!formData.password) {
      setError("Por favor, insira uma senha.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      // Obter o usuário atual (quem está criando o admin)
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const creatorEmail = currentUser.email || "admin@projeplac.com";

      // Verificar se já existe um admin com esse email
      const admins = JSON.parse(localStorage.getItem("adminUsers") || "[]");
      const emailExists = admins.some((admin: AdminUser) => admin.email === formData.email);

      if (emailExists) {
        setError("Já existe um administrador cadastrado com este email.");
        return;
      }

      // Criar novo admin
      const newAdmin: AdminUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password, // Em produção, isso deveria ser hash
        createdAt: new Date().toISOString(),
        createdBy: creatorEmail
      };

      // Salvar no localStorage
      const updatedAdmins = [...admins, newAdmin];
      localStorage.setItem("adminUsers", JSON.stringify(updatedAdmins));

      // Limpar formulário
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      setSuccess(true);
      
      // Voltar para o dashboard após 2 segundos
      setTimeout(() => {
        onBack();
      }, 2000);

    } catch (err) {
      setError("Erro ao criar administrador. Por favor, tente novamente.");
      console.error("Erro ao criar admin:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary text-primary-foreground border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-primary-foreground hover:bg-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-foreground/10 rounded-full">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Criar Novo Administrador</h1>
                  <p className="text-sm text-primary-foreground/80">Adicione um novo admin ao sistema</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={projeplacLogo} 
            alt="Projeplac Logo" 
            className="h-24 w-auto"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Informações do Administrador</span>
            </CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar uma nova conta de administrador.
              Esta conta terá acesso total ao sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Digite o nome completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@uniceplac.edu.br"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Mensagem de Sucesso */}
              {success && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Administrador criado com sucesso! Redirecionando...
                  </AlertDescription>
                </Alert>
              )}

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={success}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Administrador
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                  disabled={success}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Informações Importantes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• A senha deve ter pelo menos 6 caracteres</li>
            <li>• O email será usado para login no sistema</li>
            <li>• O administrador terá acesso total ao sistema</li>
            <li>• As credenciais serão armazenadas localmente no navegador</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
