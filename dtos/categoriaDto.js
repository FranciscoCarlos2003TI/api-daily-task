const { z } = require('zod');
const categoriaDto = z.object({ nome: z.string().trim().min(1).max(80) }).strict();
module.exports = { categoriaDto };
