const express = require('express');
const { autenticar } = require('./protecao');
const { categoriaDto } = require('../dtos/categoriaDto');
const categoriaRepositorio = require('../repositorios/categoriaRepositorio');
const { erros } = require('../erros');

const rotas = express.Router();
rotas.use(autenticar);

rotas.get('/', async (req, res) => res.json(await categoriaRepositorio.listar(req.usuario.id)));

rotas.post('/', async (req, res) => {
  const { nome } = categoriaDto.parse(req.body ?? {});
  try {
    res.status(201).json(await categoriaRepositorio.criar(req.usuario.id, nome));
  } catch (e) {
    if (e.code === 'P2002') throw erros.conflito('Você já tem uma categoria com esse nome.');
    throw e;
  }
});

module.exports = rotas;
