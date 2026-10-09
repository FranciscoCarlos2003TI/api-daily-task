const { z } = require('zod');

const tarefaDto = z.object({
  titulo: z.string().trim().min(1, 'Informe o título.').max(150),
  descricao: z.string().max(2000).optional(),
  data: z.coerce.date(),
  hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora inválida (HH:MM).').optional(),
  prioridade: z.enum(['baixa', 'media', 'alta']).default('media'),
  categoriaId: z.number().int().positive().optional(),
  lembrete: z.boolean().default(false)
}).strict()
  .refine((t) => !t.lembrete || t.hora, {
    message: 'Para ativar o lembrete, informe a data e o horário.',
    path: ['lembrete']
  });

const dataQueryDto = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD.').optional()
});

module.exports = { tarefaDto, dataQueryDto };
