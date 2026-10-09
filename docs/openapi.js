const seguro = [{ bearerAuth: [] }];
const json = (example) => ({ required: true, content: { 'application/json': { example } } });

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Daily Task API', version: '1.0.0', description: 'API do Daily Task - Projeto Integrador UESPI' },
  servers: [{ url: 'http://localhost:3000' }],
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
  paths: {
    '/api/autenticacao/cadastro': { post: { tags: ['Autenticação'], summary: 'Cadastra usuário',
      requestBody: json({ nome: 'Ana Maria', email: 'ana@teste.com', senha: 'Senha@1234' }),
      responses: { 201: { description: 'Criado' }, 400: { description: 'Dados inválidos' }, 409: { description: 'E-mail já existe' } } } },
    '/api/autenticacao/login': { post: { tags: ['Autenticação'], summary: 'Login (use modo "token" no Swagger)',
      requestBody: json({ email: 'ana@teste.com', senha: 'Senha@1234', modo: 'token' }),
      responses: { 200: { description: 'OK' }, 401: { description: 'Credenciais inválidas' } } } },
    '/api/autenticacao/renovar': { post: { tags: ['Autenticação'], summary: 'Renova sessão (cookie)', responses: { 200: { description: 'OK' } } } },
    '/api/autenticacao/logout': { post: { tags: ['Autenticação'], summary: 'Sair', responses: { 204: { description: 'OK' } } } },
    '/api/usuarios/eu': {
      get: { tags: ['Usuário'], summary: 'Dados do perfil', security: seguro, responses: { 200: { description: 'OK' } } },
      put: { tags: ['Usuário'], summary: 'Atualiza nome e e-mail', security: seguro,
        requestBody: json({ nome: 'Ana Maria', email: 'ana@teste.com' }), responses: { 200: { description: 'OK' } } } },
    '/api/usuarios/eu/senha': { put: { tags: ['Usuário'], summary: 'Troca a senha', security: seguro,
      requestBody: json({ senhaAtual: 'Senha@1234', novaSenha: 'NovaSenha@123' }), responses: { 204: { description: 'OK' } } } },
    '/api/tarefas': {
      post: { tags: ['Tarefas'], summary: 'Cria tarefa (com lembrete opcional)', security: seguro,
        requestBody: json({ titulo: 'Reunião', data: '2026-10-10', hora: '09:00', prioridade: 'alta', lembrete: true }),
        responses: { 201: { description: 'Criada' }, 400: { description: 'Dados inválidos' } } },
      get: { tags: ['Tarefas'], summary: 'Lista as tarefas do dia (?data=AAAA-MM-DD)', security: seguro, responses: { 200: { description: 'OK' } } } },
    '/api/tarefas/resumo': { get: { tags: ['Tarefas'], summary: 'Contadores do dia', security: seguro, responses: { 200: { description: 'OK' } } } },
    '/api/tarefas/{id}': {
      get: { tags: ['Tarefas'], summary: 'Busca uma tarefa', security: seguro, responses: { 200: { description: 'OK' }, 404: { description: 'Não encontrada' } } },
      put: { tags: ['Tarefas'], summary: 'Edita tarefa', security: seguro, responses: { 200: { description: 'OK' } } },
      delete: { tags: ['Tarefas'], summary: 'Exclui tarefa', security: seguro, responses: { 204: { description: 'OK' } } } },
    '/api/tarefas/{id}/concluir': { patch: { tags: ['Tarefas'], summary: 'Conclui tarefa e grava histórico', security: seguro, responses: { 200: { description: 'OK' } } } },
    '/api/lembretes/pendentes': { get: { tags: ['Lembretes'], summary: 'Lembretes vencidos (sino)', security: seguro, responses: { 200: { description: 'OK' } } } },
    '/api/lembretes/{id}': { patch: { tags: ['Lembretes'], summary: 'Liga/desliga lembrete', security: seguro,
      requestBody: json({ ativo: false }), responses: { 200: { description: 'OK' } } } },
    '/api/historico': { get: { tags: ['Histórico'], summary: 'Histórico (?de=&ate=)', security: seguro, responses: { 200: { description: 'OK' } } } },
    '/api/categorias': {
      get: { tags: ['Categorias'], summary: 'Lista categorias', security: seguro, responses: { 200: { description: 'OK' } } },
      post: { tags: ['Categorias'], summary: 'Cria categoria', security: seguro, requestBody: json({ nome: 'Trabalho' }), responses: { 201: { description: 'Criada' } } } }
  }
};
