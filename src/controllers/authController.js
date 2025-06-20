// A "lógica de negócio" para login/cadastro

import { prisma } from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// // Função para CADASTRAR um novo usuário do sistema
// export const registerUser = async (req, res) => {
//   const { usuario, senha, nivel_acesso } = req.body;

//   if (!usuario || !senha) {
//     return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(senha, salt);

//     const newUser = await prisma.controle_acessos.create({
//       data: {
//         usuario,
//         senha: passwordHash,
//         nivel_acesso: nivel_acesso || 'usuario',
//       },
//     });

//     const { senha: _, ...userWithoutPassword } = newUser;
//     res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: userWithoutPassword });

//   } catch (error) {
//     if (error.code === 'P2002' && error.meta?.target?.includes('usuario')) {
//       return res.status(409).json({ message: 'Este nome de usuário já está em uso.' });
//     }
//     console.error(error);
//     res.status(500).json({ message: 'Erro interno no servidor.' });
//   }
// };


// Função para fazer LOGIN
export const loginUser = async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  try {
    const user = await prisma.controle_acessos.findUnique({
      where: { usuario },
    });

    if (!user || !user.ativo) {
      return res.status(401).json({ message: 'Credenciais inválidas ou usuário inativo.' });
    }

    const passwordMatch = await bcrypt.compare(senha, user.senha);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    
    await prisma.controle_acessos.update({
      where: { id_acesso: user.id_acesso },
      data: { data_ultimo_login: new Date() },
    });

    const tokenPayload = {
      userId: user.id_acesso,
      usuario: user.usuario,
      nivelAcesso: user.nivel_acesso
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

    res.json({ message: 'Login bem-sucedido!', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};