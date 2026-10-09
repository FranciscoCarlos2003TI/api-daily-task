const { prisma } = require('../prisma/cliente');

const buscarDoUsuario = (id, usuarioId) => prisma.categoria.findFirst({ where: { id, usuarioId } });
const listar = (usuarioId) => prisma.categoria.findMany({ where: { usuarioId }, orderBy: { nome: 'asc' } });
const criar = (usuarioId, nome) => prisma.categoria.create({ data: { usuarioId, nome } });

module.exports = { buscarDoUsuario, listar, criar };
