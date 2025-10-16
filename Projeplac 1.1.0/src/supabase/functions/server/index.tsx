import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use('*', logger(console.log));

// Criar cliente Supabase com chave de serviço
const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Rota de signup com tipo de perfil
app.post('/make-server-0317df7d/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, ra, phone, shift, course, semester, birthDate, userType } = body;

    // Validação básica
    if (!email || !password) {
      return c.json({ error: 'Email e senha são obrigatórios' }, 400);
    }

    if (!userType || !['aluno', 'professor'].includes(userType)) {
      return c.json({ error: 'Tipo de usuário inválido. Deve ser "aluno" ou "professor"' }, 400);
    }

    const supabase = getSupabaseAdmin();

    // Criar usuário com metadados
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name: name || '',
        ra: ra || '',
        phone: phone || '',
        shift: shift || '',
        course: course || '',
        semester: semester || '',
        birthDate: birthDate || '',
        userType, // aluno ou professor
      },
      // Automaticamente confirma o email já que não temos servidor de email configurado
      email_confirm: true,
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: `Erro ao criar usuário: ${error.message}` }, 400);
    }

    return c.json({ 
      success: true, 
      message: 'Usuário criado com sucesso',
      user: {
        id: data.user.id,
        email: data.user.email,
        userType: data.user.user_metadata.userType,
      }
    });
  } catch (error) {
    console.log('Signup error during main flow:', error);
    return c.json({ error: `Erro no servidor: ${error.message}` }, 500);
  }
});

// Rota para obter informações do usuário autenticado
app.get('/make-server-0317df7d/user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Token de autenticação não fornecido' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Usuário não autenticado' }, 401);
    }

    return c.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
        ra: user.user_metadata?.ra || '',
        phone: user.user_metadata?.phone || '',
        shift: user.user_metadata?.shift || '',
        course: user.user_metadata?.course || '',
        semester: user.user_metadata?.semester || '',
        birthDate: user.user_metadata?.birthDate || '',
        userType: user.user_metadata?.userType || 'aluno',
      }
    });
  } catch (error) {
    console.log('Get user error:', error);
    return c.json({ error: `Erro no servidor: ${error.message}` }, 500);
  }
});

// Rota para listar todos os projetos (Admin)
app.get('/make-server-0317df7d/admin/projects', async (c) => {
  try {
    // Aqui você pode adicionar validação de admin se necessário
    // const isAdmin = c.req.header('X-Admin-Key') === 'admin';
    
    // Por enquanto, retorna dados mockados
    // Em produção, busque os dados do KV store ou banco de dados
    const projects = [
      {
        id: 1,
        title: "Sistema de Gestão Acadêmica",
        description: "Plataforma web para gerenciamento de notas e frequência dos alunos",
        author: "João Silva",
        course: "Engenharia de Software",
        status: "Em Revisão",
        date: "2025-10-10",
        views: 124
      },
      // Adicione mais projetos conforme necessário
    ];

    return c.json({ success: true, projects });
  } catch (error) {
    console.log('Error fetching projects:', error);
    return c.json({ error: `Erro ao buscar projetos: ${error.message}` }, 500);
  }
});

// Rota para atualizar status de projeto (Admin)
app.put('/make-server-0317df7d/admin/projects/:id/status', async (c) => {
  try {
    const projectId = c.req.param('id');
    const body = await c.req.json();
    const { status } = body;

    // Validação
    const validStatuses = ['Em Andamento', 'Publicado', 'Em Revisão'];
    if (!status || !validStatuses.includes(status)) {
      return c.json({ error: 'Status inválido' }, 400);
    }

    // Aqui você salvaria no KV store ou banco de dados
    // Por exemplo:
    // import * as kv from './kv_store.tsx';
    // await kv.set(`project:${projectId}:status`, status);

    console.log(`Status do projeto ${projectId} atualizado para ${status}`);

    return c.json({ 
      success: true, 
      message: 'Status atualizado com sucesso',
      projectId,
      newStatus: status
    });
  } catch (error) {
    console.log('Error updating project status:', error);
    return c.json({ error: `Erro ao atualizar status: ${error.message}` }, 500);
  }
});

// Rota de health check
app.get('/make-server-0317df7d/health', (c) => {
  return c.json({ status: 'ok', message: 'Projeplac server is running' });
});

Deno.serve(app.fetch);
