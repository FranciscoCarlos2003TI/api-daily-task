const jwt = require('jsonwebtoken');
const { erros } = require('../erros');
const sessaoRepositorio = require('../repositorios/sessaoRepositorio');
const { lerCookie } = require('../utils/cookies');

async function autenticar(req, res, proximo) {
  const [esquema, doCabecalho] = (req.headers.authorization || '').split(' ');
  const viaBearer = esquema === 'Bearer' && doCabecalho;
  const token = viaBearer || lerCookie(req, 'token_acesso');
  if (!token) throw erros.naoAutenticado();

  // defesa CSRF: pedidos que alteram dados e vêm por cookie precisam ter Origin permitida
  if (!viaBearer && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    const permitidas = (process.env.ORIGENS_PERMITIDAS || '').split(',');
    if (req.headers.origin && !permitidas.includes(req.headers.origin)) throw erros.proibido('Origem não permitida.');
  }

  let carga;
  try {
    carga = jwt.verify(token, process.env.JWT_SEGREDO,
      { algorithms: ['HS256'], issuer: 'daily-task', audience: 'daily-task-app' });
  } catch { throw erros.naoAutenticado('Token inválido ou expirado.'); }

  const sessao = await sessaoRepositorio.buscarAtiva(carga.sid);
  if (!sessao || sessao.usuarioId !== Number(carga.sub)) throw erros.naoAutenticado('Token inválido ou expirado.');

  req.usuario = { id: sessao.usuarioId, sessaoId: sessao.id };
  proximo();
}

module.exports = { autenticar };
