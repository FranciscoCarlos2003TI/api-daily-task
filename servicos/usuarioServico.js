const bcrypt = require('bcryptjs');
const { erros } = require('../erros');
const usuarioRepositorio = require('../repositorios/usuarioRepositorio');
const sessaoRepositorio = require('../repositorios/sessaoRepositorio');

async function obter(usuarioId) {
  const u = await usuarioRepositorio.buscarPorId(usuarioId);
  if (!u) throw erros.naoEncontrado('Usuário não encontrado.');
  return u;
}

async function atualizar(usuarioId, { nome, email }) {
  const outro = await usuarioRepositorio.buscarPorEmail(email);
  if (outro && outro.id !== usuarioId) throw erros.conflito('E-mail já cadastrado no sistema.');
  return usuarioRepositorio.atualizar(usuarioId, { nome, email });
}

async function trocarSenha(usuarioId, sessaoId, { senhaAtual, novaSenha }) {
  const u = await usuarioRepositorio.buscarComSenha(usuarioId);
  if (!(await bcrypt.compare(senhaAtual, u.senhaHash))) throw erros.credenciaisInvalidas('Senha atual incorreta.');
  await usuarioRepositorio.atualizarSenha(usuarioId, await bcrypt.hash(novaSenha, 12));
  await sessaoRepositorio.revogarOutras(usuarioId, sessaoId);
}

module.exports = { obter, atualizar, trocarSenha };
