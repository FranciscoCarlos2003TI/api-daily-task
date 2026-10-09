const express = require('express');
const { autenticar } = require('./protecao');
const { historicoQueryDto } = require('../dtos/lembreteDto');
const historicoServico = require('../servicos/historicoServico');

const rotas = express.Router();
rotas.use(autenticar);

rotas.get('/', async (req, res) => {
  const filtro = historicoQueryDto.parse(req.query);
  res.json(await historicoServico.listar(req.usuario.id, filtro));
});

module.exports = rotas;
