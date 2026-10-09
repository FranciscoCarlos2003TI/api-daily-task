const historicoRepositorio = require('../repositorios/historicoRepositorio');
const { inicioDoDia, fimDoDia, paraISO } = require('../utils/datas');

async function listar(usuarioId, { de, ate }) {
  const hojeISO = paraISO(new Date(Date.now() - 3 * 3600 * 1000));
  const inicio = de ? inicioDoDia(de) : new Date(Date.now() - 30 * 86400000);
  const fim = fimDoDia(ate || hojeISO);
  return historicoRepositorio.listar(usuarioId, inicio, fim);
}

module.exports = { listar };
