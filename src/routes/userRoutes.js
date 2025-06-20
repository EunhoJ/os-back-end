import { Router } from 'express';

import { createUser, getCurrentUser, updateUser } from '../controllers/userController.js'; 
import { checkAdmin, checkAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Rota para CRIAR um usuário (só admins)
router.post('/users', checkAdmin, createUser);

// Rota para PEGAR os dados do usuário logado (qualquer usuário logado)
router.get('/users/me', checkAuth, getCurrentUser);

// Rota para ATUALIZAR os dados do usuário logado (qualquer usuário logado)
router.put('/users/me', checkAuth, updateUser);

export default router;