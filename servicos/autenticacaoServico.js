const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { erros } = require('../erros');
const usuarioRepositorio = require('../repositorios/usuarioRepositorio');
const sessaoRepositorio = require('../repositorios/sessaoRepositorio');

const sha256 = (v) => crypto.createHash('sha256').update(v).digest('hex');
const novoRefresh = () => crypto.randomBytes(48).toString('base64url');
const MAX_TENTATIVAS = 5;
const BLOQUEIO_MIN = 15;
const MSG = 'E-mail ou senha inválidos';
const hashFalso = bcrypt.hashSync('senha-falsa-para-igualar-tempo', 12);

const acessoMin = () => Number(process.env.ACESSO_EXPIRA_MINUTOS) || 15;
const refreshDias = () => Number(process.env.REFRESH_EXPIRA_DIAS) || 7;

const gerarToken = (u, sessaoId) =>
  jwt.sign({ sub: String(u.id), sid: sessaoId }, process.env.JWT_SEGREDO, {
    algorithm: 'HS256', expiresIn: `${acessoMin()}m`, issuer: 'daily-task', audience: 'daily-task-app'
  });

async function cadastrar({ nome, email, senha }) {
  if (await usuarioRepositorio.buscarPorEmail(email)) throw erros.conflito('E-mail já cadastrado no sistema.');
  const senhaHash = await bcrypt.hash(senha, 12);
  return usuarioRepositorio.criar({ nome, email, senhaHash });
}

async function login({ email, senha }) {
  const u = await usuarioRepositorio.buscarPorEmail(email);
  if (!u) {
    await bcrypt.compare(senha, hashFalso);
    throw erros.credenciaisInvalidas(MSG);
  }
  if (u.bloqueadoAte && u.bloqueadoAte > new Date()) {
    throw erros.muitasRequisicoes('Conta bloqueada temporariamente. Tente mais tarde.');
  }
  if (!(await bcrypt.compare(senha, u.senhaHash))) {
    const n = u.tentativasFalhas + 1;
    const bloquear = n >= MAX_TENTATIVAS;
    await usuarioRepositorio.registrarFalha(u.id, bloquear ? 0 : n,
      bloquear ? new Date(Date.now() + BLOQUEIO_MIN * 60000) : null);
    throw erros.credenciaisInvalidas(MSG);
  }
  await usuarioRepositorio.zerarFalhas(u.id);

  const refresh = novoRefresh();
  const sessao = await sessaoRepositorio.criar({
    usuarioId: u.id, refreshHash: sha256(refresh),
    expiraEm: new Date(Date.now() + refreshDias() * 86400000)
  });
  return {
    usuario: { id: u.id, nome: u.nome, email: u.email },
    token: gerarToken(u, sessao.id), refreshToken: refresh, acessoExpiraEmMinutos: acessoMin()
  };
}

async function renovar(refreshToken) {
  const negar = () => erros.naoAutenticado('Sessão inválida ou expirada. Faça login novamente.');
  if (!refreshToken) throw negar();
  const sessao = await sessaoRepositorio.buscarPorRefresh(sha256(refreshToken));
  if (!sessao || sessao.revogadaEm || sessao.expiraEm <= new Date()) throw negar();

  const novo = novoRefresh();
  const trocou = await sessaoRepositorio.rotacionar(sessao.id, sha256(refreshToken),
    { novoHash: sha256(novo), expiraEm: new Date(Date.now() + refreshDias() * 86400000) });
  if (!trocou) throw negar();

  const u = await usuarioRepositorio.buscarPorId(sessao.usuarioId);
  return { usuario: u, token: gerarToken(u, sessao.id), refreshToken: novo, acessoExpiraEmMinutos: acessoMin() };
}

async function sair(refreshToken) {
  if (!refreshToken) return;
  const sessao = await sessaoRepositorio.buscarPorRefresh(sha256(refreshToken));
  if (sessao) await sessaoRepositorio.revogar(sessao.id);
}

module.exports = { cadastrar, login, renovar, sair };
