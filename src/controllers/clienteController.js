import { prisma } from '../config/prismaClient.js';

// --- CREATE --
export const createCliente = async (req, res) => {
  // 1. Captura todos os campos do corpo da requisição
  const {
    cpf_cliente,
    nome_cliente,
    tel_fixo_cliente,
    tel_celular_cliente,
    data_nasc_cliente,
    cep,
    endereco_cliente,
    bairro_cliente,
    email_cliente,
    obs_cliente,
  } = req.body;

  if (!cpf_cliente || !nome_cliente) {
    return res.status(400).json({ message: 'Nome e CPF do cliente são obrigatórios.' });
  }

  try {
    // 2. Cria o novo cliente no banco com todos os dados fornecidos
    const novoCliente = await prisma.clientes.create({
      data: {
        cpf_cliente,
        nome_cliente,
        tel_fixo_cliente,
        tel_celular_cliente,
        // O campo de data precisa ser um objeto Date, o JS converte a string do formulário
        data_nasc_cliente: data_nasc_cliente ? new Date(data_nasc_cliente) : null,
        cep,
        endereco_cliente,
        bairro_cliente,
        email_cliente,
        obs_cliente,
      },
    });

    res.status(201).json({ message: 'Cliente cadastrado com sucesso!', cliente: novoCliente });

  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('cpf_cliente')) {
      return res.status(409).json({ message: 'Este CPF já está cadastrado.' });
    }
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// --- READ ALL ---
export const listClientes = async (req, res) => {
  console.log("--- ROTA DE LISTAGEM DE CLIENTES ACIONADA ---");

  try {
    // Usamos o findMany() do Prisma para buscar todos os registros
    const clientes = await prisma.clientes.findMany({
      // Opcional: ordenar os resultados por nome em ordem alfabética
      orderBy: {
        nome_cliente: 'asc',
      },
    });

    res.status(200).json(clientes); // Retorna a lista de clientes em formato JSON

  } catch (error) {
    console.error("!!! ERRO AO LISTAR CLIENTES:", error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// --- READ (ONE) ---
export const getClienteById = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await prisma.clientes.findUnique({
      where: { id_cliente: parseInt(id) },
    });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    console.error("ERRO AO BUSCAR CLIENTE:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// --- UPDATE ---
export const updateCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCliente = await prisma.clientes.update({
      where: { id_cliente: parseInt(id) },
      data: {
        ...req.body,
        data_nasc_cliente: req.body.data_nasc_cliente ? new Date(req.body.data_nasc_cliente) : null,
      },
    });
    res.status(200).json({ message: 'Cliente atualizado com sucesso!', cliente: updatedCliente });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Este CPF já pertence a outro cliente.' });
    }
    console.error("ERRO AO ATUALIZAR CLIENTE:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// --- DELETE ---
export const deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.clientes.delete({
      where: { id_cliente: parseInt(id) },
    });
    // 204 No Content é a resposta padrão para um delete bem-sucedido
    res.status(204).send();
  } catch (error) {
    // Erro P2025 significa 'Registro para deletar não encontrado'
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Cliente não encontrado para deletar.' });
    }
    console.error("ERRO AO DELETAR CLIENTE:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};