function lerCookie(req, nome) {
  const c = (req.headers.cookie || '').split('; ').find((x) => x.startsWith(nome + '='));
  return c ? decodeURIComponent(c.slice(nome.length + 1)) : null;
}
module.exports = { lerCookie };
