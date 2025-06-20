import { prisma } from '../config/prismaClient.js';
import bcrypt from 'bcrypt';

// A função de cadastro, agora aqui
export const createUser = async (req, res) => { /* ... código de cadastro  ... */ };

// Nova função para buscar o usuário logado
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId; checkAuth
    const user = await prisma.controle_acessos.findUnique({
      where: { id_acesso: userId },
      select: { 
        id_acesso: true,
        usuario: true,
        nome: true,
        nivel_acesso: true,
        avatar_url: true,
      }
    });

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dados do usuário.' });
  }
};


export const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { nome, usuario, avatar_url } = req.body; // Campos que podem ser editados

    const dataToUpdate = {};
    if (nome !== undefined) dataToUpdate.nome = nome;
    if (usuario !== undefined) dataToUpdate.usuario = usuario;
    if (avatar_url !== undefined) dataToUpdate.avatar_url = avatar_url;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: 'Nenhum dado para atualizar.' });
    }

    const updatedUser = await prisma.controle_acessos.update({
      where: { id_acesso: userId },
      data: {
        nome,
        usuario,
      },
    });

    const { senha, ...userWithoutPassword } = updatedUser;
    res.json({ message: 'Perfil atualizado com sucesso!', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o perfil.' });
  }
};