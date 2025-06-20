import { Router } from 'express';
import {
  createCliente,
  listClientes,
  getClienteById,
  updateCliente,
  deleteCliente
} from '../controllers/clienteController.js'; 
import { checkAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Rota para CRIAR um novo cliente
router.post('/', checkAuth, createCliente);

// Rota para LISTAR TODOS os clientes
router.get('/', checkAuth, listClientes);

// Rota para BUSCAR UM cliente pelo ID
router.get('/:id', checkAuth, getClienteById);

// Rota para ATUALIZAR UM cliente pelo ID
router.put('/:id', checkAuth, updateCliente);

// Rota para DELETAR UM cliente pelo ID
router.delete('/:id', checkAuth, deleteCliente);

export default router;