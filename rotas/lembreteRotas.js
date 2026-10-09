const express = require('express');
const { autenticar } = require('./protecao');
const { lembreteDto } = require('../dtos/lembreteDto');
const lembreteServico = require('../servicos/lembreteServico');
const { erros } = require('../erros');

const rotas = express.Router();
rotas.use(autenticar);

rotas.get('/pendentes', async (req, res) => res.json(await lembreteServico.pendentes(req.usuario.id)));

rotas.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw erros.requisicaoInvalida('Id inválido.');
  const { ativo } = lembreteDto.parse(req.body ?? {});
  res.json(await lembreteServico.alterarAtivo(req.usuario.id, id, ativo));
});

module.exports = rotas;
