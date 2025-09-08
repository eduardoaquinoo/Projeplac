import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(username, password);
    
    if (!success) {
      setError('Usuário ou senha inválidos');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8" data-aos="fade-down">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
            <i className="fas fa-code text-green-600 mr-2"></i>
            Projeplac
          </h1>
          <p className="text-gray-600 mt-2">Repositório Digital de Projetos TI</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0" data-aos="fade-up">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl">Bem-vindo de volta!</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <i className="fas fa-exclamation-triangle text-red-500"></i>
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-green-600 to-orange-500 text-white hover:from-green-700 hover:to-orange-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Entrando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Users Info */}
        <Card className="mt-6 bg-blue-50 border-blue-200" data-aos="fade-up" data-aos-delay="200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-blue-700">
              <i className="fas fa-info-circle mr-2"></i>
              Usuários de Demonstração
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm text-blue-600">
              <div className="flex justify-between">
                <span className="font-medium">admin</span>
                <span>123456</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">admin1</span>
                <span>1234567</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">usuario</span>
                <span>123456</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}