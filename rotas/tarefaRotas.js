const express = require('express');
const { autenticar } = require('./protecao');
const { tarefaDto, dataQueryDto } = require('../dtos/tarefaDto');
const tarefaServico = require('../servicos/tarefaServico');
const { hoje } = require('../utils/datas');
const { erros } = require('../erros');

const rotas = express.Router();
rotas.use(autenticar);

const diaDaQuery = (query) => {
  const { data } = dataQueryDto.parse(query);
  return data ? new Date(data) : hoje();
};
const idDaRota = (req) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw erros.requisicaoInvalida('Id inválido.');
  return id;
};

rotas.post('/', async (req, res) => {
  const dados = tarefaDto.parse(req.body ?? {});
  res.status(201).json(await tarefaServico.criar(req.usuario.id, dados));
});

rotas.get('/', async (req, res) => res.json(await tarefaServico.listarDoDia(req.usuario.id, diaDaQuery(req.query))));

// /resumo precisa vir antes de /:id
rotas.get('/resumo', async (req, res) => res.json(await tarefaServico.resumo(req.usuario.id, diaDaQuery(req.query))));

rotas.get('/:id', async (req, res) => res.json(await tarefaServico.obter(req.usuario.id, idDaRota(req))));

rotas.put('/:id', async (req, res) => {
  const dados = tarefaDto.parse(req.body ?? {});
  res.json(await tarefaServico.atualizar(req.usuario.id, idDaRota(req), dados));
});

rotas.patch('/:id/concluir', async (req, res) => res.json(await tarefaServico.concluir(req.usuario.id, idDaRota(req))));

rotas.delete('/:id', async (req, res) => {
  await tarefaServico.excluir(req.usuario.id, idDaRota(req));
  res.status(204).end();
});

module.exports = rotas;
