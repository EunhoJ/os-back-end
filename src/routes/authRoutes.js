// Define as rotas (/login, /cadastro)
import { Router } from 'express';
import { loginUser } from '../controllers/authController.js';

const router = Router();

// Rota para registrar um novo usuário do sistema
// POST http://localhost:3300/api/usuarios/cadastro
// router.post('/usuarios/cadastro', registerUser);

// Rota para fazer login
// POST http://localhost:3300/api/login
router.post('/login', loginUser);

export default router;