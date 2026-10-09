const { z } = require('zod');

const cadastroDto = z.object({
  nome: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(150),
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.').max(200)
}).strict();

const loginDto = z.object({
  email: z.string().trim().toLowerCase().email(),
  senha: z.string().min(1).max(200),
  modo: z.enum(['cookie', 'token']).default('cookie')
}).strict();

const perfilDto = z.object({
  nome: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(150)
}).strict();

const trocaSenhaDto = z.object({
  senhaAtual: z.string().min(1).max(200),
  novaSenha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.').max(200)
}).strict();

module.exports = { cadastroDto, loginDto, perfilDto, trocaSenhaDto };
