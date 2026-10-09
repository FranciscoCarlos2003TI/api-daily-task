const { prisma } = require('../prisma/cliente');

const criar = (data) => prisma.sessao.create({ data });
const buscarPorRefresh = (refreshHash) => prisma.sessao.findUnique({ where: { refreshHash } });
const buscarAtiva = (id) =>
  prisma.sessao.findFirst({ where: { id, revogadaEm: null, expiraEm: { gt: new Date() } } });

// troca o refresh só se ainda for o antigo (impede reuso)
async function rotacionar(id, hashAntigo, { novoHash, expiraEm }) {
  const r = await prisma.sessao.updateMany({
    where: { id, refreshHash: hashAntigo, revogadaEm: null },
    data: { refreshHash: novoHash, expiraEm }
  });
  return r.count === 1;
}
const revogar = (id) => prisma.sessao.update({ where: { id }, data: { revogadaEm: new Date() } });
const revogarOutras = (usuarioId, sessaoId) =>
  prisma.sessao.updateMany({
    where: { usuarioId, id: { not: sessaoId }, revogadaEm: null },
    data: { revogadaEm: new Date() }
  });

module.exports = { criar, buscarPorRefresh, buscarAtiva, rotacionar, revogar, revogarOutras };
