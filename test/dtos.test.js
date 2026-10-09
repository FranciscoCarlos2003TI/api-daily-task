const test = require('node:test');
const assert = require('node:assert');
const { cadastroDto } = require('../dtos/autenticacaoDto');
const { tarefaDto } = require('../dtos/tarefaDto');

test('cadastro recusa senha curta', () => {
  assert.throws(() => cadastroDto.parse({ nome: 'Ana', email: 'a@a.com', senha: '123' }));
});
test('cadastro recusa campo extra (strict)', () => {
  assert.throws(() => cadastroDto.parse({ nome: 'Ana', email: 'a@a.com', senha: '12345678', confirmaSenha: 'x' }));
});
test('tarefa exige título', () => {
  assert.throws(() => tarefaDto.parse({ titulo: '', data: '2026-10-10' }));
});
test('lembrete exige hora (RN2)', () => {
  assert.throws(() => tarefaDto.parse({ titulo: 'x', data: '2026-10-10', lembrete: true }));
});
test('tarefa válida usa prioridade media por padrão', () => {
  assert.strictEqual(tarefaDto.parse({ titulo: 'x', data: '2026-10-10' }).prioridade, 'media');
});
