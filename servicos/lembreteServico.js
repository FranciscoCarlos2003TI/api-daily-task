const { erros } = require('../erros');
const lembreteRepositorio = require('../repositorios/lembreteRepositorio');
const { horaParaTexto } = require('../utils/datas');

async function pendentes(usuarioId) {
  const lista = await lembreteRepositorio.vencidosDoUsuario(usuarioId, new Date());
  await lembreteRepositorio.marcarEnviados(lista.map((l) => l.id));
  return lista.map((l) => ({
    id: l.id, titulo: l.tarefa.titulo, hora: horaParaTexto(l.tarefa.hora), prioridade: l.tarefa.prioridade
  }));
}

async function alterarAtivo(usuarioId, id, ativo) {
  const l = await lembreteRepositorio.buscarDoUsuario(id, usuarioId);
  if (!l) throw erros.naoEncontrado('Lembrete não encontrado.');
  return lembreteRepositorio.alterarAtivo(id, ativo);
}

module.exports = { pendentes, alterarAtivo };
