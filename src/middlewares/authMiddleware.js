
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar se o usuário está autenticado e é um admin
export const checkAdmin = (req, res, next) => {
  // 1. Pega o token do header da requisição
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  // 2. Verifica se o token é válido
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Verifica se o nível de acesso é de administrador
    if (decoded.nivelAcesso !== 'administrador') {
      return res.status(403).json({ message: 'Acesso negado. Requer permissão de administrador.' });
    }

    // Se tudo estiver certo, anexa os dados do usuário na requisição e continua
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

// Novo middleware para verificar se o usuário está apenas autenticado
export const checkAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Anexa os dados do token (userId, usuario, etc.) na requisição
    next(); // Continua para a próxima função (o controller)
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};