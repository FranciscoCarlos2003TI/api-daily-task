const { z } = require('zod');
const lembreteDto = z.object({ ativo: z.boolean() }).strict();
const historicoQueryDto = z.object({
  de: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  ate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});
module.exports = { lembreteDto, historicoQueryDto };
