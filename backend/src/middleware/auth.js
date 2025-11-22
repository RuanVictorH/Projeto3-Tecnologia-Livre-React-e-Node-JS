// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'minha_chave_secreta_agenda_123'; // Mesma chave do authController

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  // O header vem como: "Bearer <token>"
  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Salva os dados do usuário na requisição
    return next(); // Pode passar
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};