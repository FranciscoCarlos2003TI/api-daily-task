# Daily Task API PI2

API do Daily Task (Projeto Integrador · UESPI/UAPI). Node.js 22 · Express 5 · Prisma · Neon (PostgreSQL) · JWT · Swagger.

## Como rodar
1. `npm install`
2. Copie `.env.example` para `.env` e preencha `DATABASE_URL` (Neon, URL com `-pooler`) e `JWT_SEGREDO`
   - gerar chave: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
3. `npx prisma migrate dev --name inicial`
4. `npx prisma generate`
5. `npm run dev` → http://localhost:3000/docs

## Fluxo de um pedido
Rota → DTO (zod) → Serviço → Repositório → Prisma → Neon

## Rotas (19)
| Método e rota | Login? |
|---|---|
| POST /api/autenticacao/cadastro | Não |
| POST /api/autenticacao/login | Não |
| POST /api/autenticacao/renovar | Não (cookie) |
| POST /api/autenticacao/logout | Não |
| GET /api/usuarios/eu | Sim |
| PUT /api/usuarios/eu | Sim |
| PUT /api/usuarios/eu/senha | Sim |
| POST /api/tarefas | Sim |
| GET /api/tarefas?data=AAAA-MM-DD | Sim |
| GET /api/tarefas/resumo?data= | Sim |
| GET /api/tarefas/:id | Sim |
| PUT /api/tarefas/:id | Sim |
| DELETE /api/tarefas/:id | Sim |
| PATCH /api/tarefas/:id/concluir | Sim |
| PATCH /api/lembretes/:id | Sim |
| GET /api/lembretes/pendentes | Sim |
| GET /api/historico?de=&ate= | Sim |
| GET e POST /api/categorias | Sim |

## Testes
`npm test`
