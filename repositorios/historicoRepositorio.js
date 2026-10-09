const { prisma } = require('../prisma/cliente');

const criar = ({ tarefaId, usuarioId }, tx = prisma) => tx.historico.create({ data: { tarefaId, usuarioId } });
const listar = (usuarioId, de, ate) =>
  prisma.historico.findMany({
    where: { usuarioId, concluidaEm: { gte: de, lte: ate } },
    include: { tarefa: { select: { titulo: true, prioridade: true } } },
    orderBy: { concluidaEm: 'desc' }
  });

module.exports = { criar, listar };
