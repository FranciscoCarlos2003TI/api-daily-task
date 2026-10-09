const { prisma } = require('../prisma/cliente');
const campos = { id: true, nome: true, email: true, criadoEm: true };

const criar = ({ nome, email, senhaHash }) => prisma.usuario.create({ data: { nome, email, senhaHash }, select: campos });
const buscarPorEmail = (email) => prisma.usuario.findUnique({ where: { email: email.toLowerCase() } });
const buscarPorId = (id) => prisma.usuario.findUnique({ where: { id }, select: campos });
const buscarComSenha = (id) => prisma.usuario.findUnique({ where: { id } });
const atualizar = (id, { nome, email }) => prisma.usuario.update({ where: { id }, data: { nome, email }, select: campos });
const atualizarSenha = (id, senhaHash) => prisma.usuario.update({ where: { id }, data: { senhaHash } });
const registrarFalha = (id, tentativasFalhas, bloqueadoAte) =>
  prisma.usuario.update({ where: { id }, data: { tentativasFalhas, bloqueadoAte } });
const zerarFalhas = (id) => prisma.usuario.update({ where: { id }, data: { tentativasFalhas: 0, bloqueadoAte: null } });

module.exports = { criar, buscarPorEmail, buscarPorId, buscarComSenha, atualizar, atualizarSenha, registrarFalha, zerarFalhas };
