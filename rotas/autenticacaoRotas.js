const express = require('express');
const rateLimit = require('express-rate-limit');
const { cadastroDto, loginDto } = require('../dtos/autenticacaoDto');
const autenticacaoServico = require('../servicos/autenticacaoServico');
const { erros } = require('../erros');
const { lerCookie } = require('../utils/cookies');

const rotas = express.Router();
const limitar = (max) => rateLimit({ windowMs: 15 * 60 * 1000, limit: max,
  handler: (req, res, proximo) => proximo(erros.muitasRequisicoes()) });
const limiteCadastro = limitar(20);
const limiteLogin = limitar(20);
const limiteRenovacao = limitar(60);

const base = () => ({ httpOnly: true, secure: process.env.COOKIE_SECURE !== 'false', sameSite: 'lax' });

function gravarCookies(res, { token, refreshToken }) {
  res.cookie('token_acesso', token, { ...base(), path: '/', maxAge: 15 * 60 * 1000 });
  res.cookie('token_renovacao', refreshToken,
    { ...base(), path: '/api/autenticacao', maxAge: 7 * 24 * 60 * 60 * 1000 });
}
function limparCookies(res) {
  res.clearCookie('token_acesso', { ...base(), path: '/' });
  res.clearCookie('token_renovacao', { ...base(), path: '/api/autenticacao' });
}

rotas.post('/cadastro', limiteCadastro, async (req, res) => {
  const dados = cadastroDto.parse(req.body ?? {});
  const usuario = await autenticacaoServico.cadastrar(dados);
  res.status(201).json({ mensagem: 'Cadastro realizado! Faça login para continuar.', usuario });
});

rotas.post('/login', limiteLogin, async (req, res) => {
  const dados = loginDto.parse(req.body ?? {});
  const r = await autenticacaoServico.login(dados);
  if (dados.modo === 'cookie') { gravarCookies(res, r); return res.json({ usuario: r.usuario }); }
  res.json({ tipoToken: 'Bearer', ...r });
});

rotas.post('/renovar', limiteRenovacao, async (req, res) => {
  const r = await autenticacaoServico.renovar(lerCookie(req, 'token_renovacao'));
  gravarCookies(res, r);
  res.json({ usuario: r.usuario });
});

rotas.post('/logout', limiteRenovacao, async (req, res) => {
  await autenticacaoServico.sair(lerCookie(req, 'token_renovacao'));
  limparCookies(res);
  res.status(204).end();
});

module.exports = rotas;
