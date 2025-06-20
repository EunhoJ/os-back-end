// prisma/seed.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Inicializa o Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seeding...');

  const adminUsername = 'john';
  const adminPassword = '12345'; // Defina uma senha padrão forte

  // Criptografa a senha padrão
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  // Usamos 'upsert' em vez de 'create'.
  // 'Upsert' tenta encontrar um registro. Se não encontrar, ele cria.
  // Se encontrar, ele atualiza. Isso evita erros se você rodar o seed mais de uma vez.
  const adminUser = await prisma.controle_acessos.upsert({
    where: { usuario: adminUsername }, // Campo único para encontrar o usuário
    update: {}, // Não fazemos nada se o usuário já existir
    create: {
      usuario: adminUsername,
      senha: hashedPassword,
      nivel_acesso: 'administrador',
      ativo: true,
      nome: 'John', // Adicionando o nome
      avatar_url: null
    },
  });

  console.log(`Usuário '${adminUser.usuario}' criado/confirmado com sucesso.`);
  console.log('Seeding finalizado.');
}

// Executa a função main e garante que a conexão com o banco seja fechada
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });