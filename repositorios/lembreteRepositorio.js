const { prisma } = require('../prisma/cliente');

const criar = (dados, tx = prisma) => tx.lembrete.create({ data: dados });
const desativarDaTarefa = (tarefaId, tx = prisma) =>
  tx.lembrete.updateMany({ where: { tarefaId }, data: { ativo: false } });
const removerDaTarefa = (tarefaId, tx = prisma) => tx.lembrete.deleteMany({ where: { tarefaId } });

const buscarDoUsuario = (id, usuarioId) =>
  prisma.lembrete.findFirst({ where: { id, tarefa: { usuarioId } } });
const alterarAtivo = (id, ativo) => prisma.lembrete.update({ where: { id }, data: { ativo } });

const vencidosDoUsuario = (usuarioId, agora) =>
  prisma.lembrete.findMany({
    where: { ativo: true, enviado: false, dispararEm: { lte: agora }, tarefa: { usuarioId, concluida: false } },
    include: { tarefa: { select: { titulo: true, hora: true, prioridade: true } } }
  });
const marcarEnviados = (ids) =>
  ids.length ? prisma.lembrete.updateMany({ where: { id: { in: ids } }, data: { enviado: true } }) : null;

module.exports = { criar, desativarDaTarefa, removerDaTarefa, buscarDoUsuario, alterarAtivo, vencidosDoUsuario, marcarEnviados };
