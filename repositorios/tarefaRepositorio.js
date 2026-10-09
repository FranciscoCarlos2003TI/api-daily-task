const { prisma } = require('../prisma/cliente');

const criar = (dados, tx = prisma) => tx.tarefa.create({ data: dados });

// REGRA DE OURO: sempre filtrar pelo usuarioId do token
const buscarDoUsuario = (id, usuarioId) =>
  prisma.tarefa.findFirst({ where: { id, usuarioId }, include: { categoria: true, lembretes: true } });

const listarDoDia = (usuarioId, dia) =>
  prisma.tarefa.findMany({
    where: { usuarioId, data: dia },
    orderBy: [{ concluida: 'asc' }, { hora: 'asc' }],
    include: { categoria: true, lembretes: true }
  });

const atualizar = (id, dados, tx = prisma) => tx.tarefa.update({ where: { id }, data: dados });
const marcarConcluida = (id, tx = prisma) => tx.tarefa.update({ where: { id }, data: { concluida: true } });
const excluir = (id) => prisma.tarefa.delete({ where: { id } });

async function resumo(usuarioId, dia) {
  const base = { usuarioId, data: dia };
  const [total, concluidas, alta] = await Promise.all([
    prisma.tarefa.count({ where: base }),
    prisma.tarefa.count({ where: { ...base, concluida: true } }),
    prisma.tarefa.count({ where: { ...base, prioridade: 'alta' } })
  ]);
  return { total, concluidas, pendentes: total - concluidas, alta };
}

module.exports = { criar, buscarDoUsuario, listarDoDia, atualizar, marcarConcluida, excluir, resumo };
