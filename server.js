require('dotenv/config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { ZodError } = require('zod');
const { ErroHttp, erros } = require('./erros');
const especificacao = require('./docs/openapi');

const app = express();

app.use(helmet());
app.use(cors({
  origin: (origem, cb) => cb(null, !origem || (process.env.ORIGENS_PERMITIDAS || '').split(',').includes(origem)),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300,
  handler: (req, res, proximo) => proximo(erros.muitasRequisicoes()) }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/saude', (req, res) => res.json({ status: 'ok', servico: 'Daily Task API' }));

app.use('/api/autenticacao', require('./rotas/autenticacaoRotas'));
app.use('/api/usuarios', require('./rotas/usuarioRotas'));
app.use('/api/tarefas', require('./rotas/tarefaRotas'));
app.use('/api/categorias', require('./rotas/categoriaRotas'));
app.use('/api/lembretes', require('./rotas/lembreteRotas'));
app.use('/api/historico', require('./rotas/historicoRotas'));

if (process.env.DOCS_ATIVADO ? process.env.DOCS_ATIVADO === 'true' : process.env.NODE_ENV !== 'production') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(especificacao));
}

app.use((req, res, proximo) => proximo(erros.naoEncontrado()));
app.use((erro, req, res, proximo) => {
  if (erro instanceof ZodError) return res.status(400).json({ erro: { codigo: 'DADOS_INVALIDOS', detalhes: erro.issues } });
  if (erro instanceof ErroHttp) return res.status(erro.status).json({ erro: { codigo: erro.codigo, mensagem: erro.message } });
  if (erro.type === 'entity.parse.failed') return res.status(400).json({ erro: { codigo: 'JSON_INVALIDO', mensagem: 'JSON inválido.' } });
  console.error(erro);
  res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: 'Erro inesperado.' } });
});

if (require.main === module) {
  app.listen(Number(process.env.PORTA) || 3000, () => console.log('Daily Task API rodando'));
}

module.exports = app;
