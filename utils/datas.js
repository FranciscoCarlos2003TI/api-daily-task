const FUSO = '-03:00'; // horário de Brasília

// 'YYYY-MM-DD' (Date em UTC à meia-noite) -> 'YYYY-MM-DD'
const paraISO = (d) => d.toISOString().slice(0, 10);

// 'HH:MM' -> Date (coluna TIME do Postgres)
const horaParaDate = (hhmm) => (hhmm ? new Date(`1970-01-01T${hhmm}:00.000Z`) : null);

// Date (coluna TIME) -> 'HH:MM'
const horaParaTexto = (d) => (d ? d.toISOString().slice(11, 16) : null);

// data + hora -> instante exato do lembrete
const juntar = (data, hhmm) => new Date(`${paraISO(data)}T${hhmm}:00${FUSO}`);

const inicioDoDia = (iso) => new Date(`${iso}T00:00:00${FUSO}`);
const fimDoDia = (iso) => new Date(`${iso}T23:59:59.999${FUSO}`);

// data de hoje no fuso de Brasília, como Date UTC à meia-noite
function hoje() {
  const iso = new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10);
  return new Date(iso);
}

module.exports = { paraISO, horaParaDate, horaParaTexto, juntar, inicioDoDia, fimDoDia, hoje };
