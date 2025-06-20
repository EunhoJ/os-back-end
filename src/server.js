// Ponto de entrada, configura o Express e une tudo.
import 'dotenv/config'; // Garante que as variáveis do .env sejam carregadas
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // Importa nossas rotas de autenticação
import userRoutes from './routes/userRoutes.js'; // Importa para o gerenciamento de usuários.
import clienteRoutes from './routes/clienteRoutes.js';

const app = express();

// Middlewares essenciais
app.use(cors()); // Permite requisições de origens diferentes (do seu frontend)
app.use(express.json()); // Permite que o Express entenda requisições com corpo em JSON

// Rota principal da API
app.get('/api', (req, res) => {
  res.json({ message: 'API de autenticação funcionando!' });
});

// Carrega e utiliza as rotas de autenticação com o prefixo /api
app.use('/api', authRoutes);

// Rotas protegidas para gerenciamento de usuários
app.use('/api', userRoutes); // <<< USE AS NOVAS ROTAS

// 2. E ESSA LINHA PRECISA EXISTIR, com o prefixo correto
app.use('/api/clientes', clienteRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});