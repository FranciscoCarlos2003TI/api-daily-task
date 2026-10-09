const { prisma } = require('../prisma/cliente');
const { erros } = require('../erros');
const tarefaRepositorio = require('../repositorios/tarefaRepositorio');
const categoriaRepositorio = require('../repositorios/categoriaRepositorio');
const lembreteRepositorio = require('../repositorios/lembreteRepositorio');
const historicoRepositorio = require('../repositorios/historicoRepositorio');
const { paraISO, horaParaDate, horaParaTexto, juntar } = require('../utils/datas');

// devolve a tarefa no formato que o front usa (data AAAA-MM-DD, hora HH:MM)
const apresentar = (t) => ({ ...t, data: paraISO(t.data), hora: horaParaTexto(t.hora) });

async function validarCategoria(categoriaId, usuarioId) {
  if (!categoriaId) return;
  const cat = await categoriaRepositorio.buscarDoUsuario(categoriaId, usuarioId);
  if (!cat) throw erros.requisicaoInvalida('Categoria inexistente.');
}

async function criar(usuarioId, { lembrete, hora, ...dados }) {
  await validarCategoria(dados.categoriaId, usuarioId);
  const tarefa = await prisma.$transaction(async (tx) => {
    const t = await tarefaRepositorio.criar({ usuarioId, hora: horaParaDate(hora), ...dados }, tx);
    if (lembrete) await lembreteRepositorio.criar({ tarefaId: t.id, dispararEm: juntar(dados.data, hora) }, tx);
    return t;
  });
  return apresentar(tarefa);
}

async function obter(usuarioId, id) {
  const t = await tarefaRepositorio.buscarDoUsuario(id, usuarioId);
  if (!t) throw erros.naoEncontrado('Tarefa não encontrada.');
  return apresentar(t);
}

async function listarDoDia(usuarioId, dia) {
  const lista = await tarefaRepositorio.listarDoDia(usuarioId, dia);
  return lista.map(apresentar);
}

const resumo = (usuarioId, dia) => tarefaRepositorio.resumo(usuarioId, dia);

async function atualizar(usuarioId, id, { lembrete, hora, ...dados }) {
  const existente = await tarefaRepositorio.buscarDoUsuario(id, usuarioId);
  if (!existente) throw erros.naoEncontrado('Tarefa não encontrada.');
  await validarCategoria(dados.categoriaId, usuarioId);

  const tarefa = await prisma.$transaction(async (tx) => {
    const t = await tarefaRepositorio.atualizar(id, {
      ...dados, hora: horaParaDate(hora), categoriaId: dados.categoriaId ?? null, descricao: dados.descricao ?? null
    }, tx);
    await lembreteRepositorio.removerDaTarefa(id, tx);
    if (lembrete && !existente.concluida) {
      await lembreteRepositorio.criar({ tarefaId: id, dispararEm: juntar(dados.data, hora) }, tx);
    }
    return t;
  });
  return apresentar(tarefa);
}

async function excluir(usuarioId, id) {
  const t = await tarefaRepositorio.buscarDoUsuario(id, usuarioId);
  if (!t) throw erros.naoEncontrado('Tarefa não encontrada.');
  await tarefaRepositorio.excluir(id);
}

async function concluir(usuarioId, id) {
  const tarefa = await tarefaRepositorio.buscarDoUsuario(id, usuarioId);
  if (!tarefa) throw erros.naoEncontrado('Tarefa não encontrada.');
  if (tarefa.concluida) return apresentar(tarefa);
  await prisma.$transaction(async (tx) => {
    await tarefaRepositorio.marcarConcluida(id, tx);
    await historicoRepositorio.criar({ tarefaId: id, usuarioId }, tx);
    await lembreteRepositorio.desativarDaTarefa(id, tx);
  });
  return apresentar({ ...tarefa, concluida: true });
}

module.exports = { criar, obter, listarDoDia, resumo, atualizar, excluir, concluir };
