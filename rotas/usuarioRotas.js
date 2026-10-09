const express = require('express');
const { autenticar } = require('./protecao');
const { perfilDto, trocaSenhaDto } = require('../dtos/autenticacaoDto');
const usuarioServico = require('../servicos/usuarioServico');

const rotas = express.Router();
rotas.use(autenticar);

rotas.get('/eu', async (req, res) => res.json(await usuarioServico.obter(req.usuario.id)));

rotas.put('/eu', async (req, res) => {
  const dados = perfilDto.parse(req.body ?? {});
  res.json(await usuarioServico.atualizar(req.usuario.id, dados));
});

rotas.put('/eu/senha', async (req, res) => {
  const dados = trocaSenhaDto.parse(req.body ?? {});
  await usuarioServico.trocarSenha(req.usuario.id, req.usuario.sessaoId, dados);
  res.status(204).end();
});

module.exports = rotas;
