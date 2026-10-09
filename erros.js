class ErroHttp extends Error {
  constructor(status, codigo, mensagem) {
    super(mensagem);
    this.status = status;
    this.codigo = codigo;
  }
}

const erros = {
  requisicaoInvalida: (m = 'Requisição inválida.') => new ErroHttp(400, 'REQUISICAO_INVALIDA', m),
  naoAutenticado: (m = 'Não autenticado.') => new ErroHttp(401, 'NAO_AUTENTICADO', m),
  credenciaisInvalidas: (m = 'Credenciais inválidas.') => new ErroHttp(401, 'CREDENCIAIS_INVALIDAS', m),
  proibido: (m = 'Acesso negado.') => new ErroHttp(403, 'PROIBIDO', m),
  naoEncontrado: (m = 'Recurso não encontrado.') => new ErroHttp(404, 'NAO_ENCONTRADO', m),
  conflito: (m = 'Conflito de dados.') => new ErroHttp(409, 'CONFLITO', m),
  muitasRequisicoes: (m = 'Muitas requisições. Tente mais tarde.') => new ErroHttp(429, 'MUITAS_REQUISICOES', m)
};

module.exports = { ErroHttp, erros };
