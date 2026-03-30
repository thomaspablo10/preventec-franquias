import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida.");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "master@ricossystems.com.br";
  const password = "123456";

  const passwordHash = await hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Master Ricossystems",
      passwordHash,
      role: UserRole.MASTER,
      isActive: true,
      publicName: "Master Ricossystems",
      jobTitle: "Administrador Master",
    },
    create: {
      name: "Master Ricossystems",
      email,
      passwordHash,
      role: UserRole.MASTER,
      isActive: true,
      publicName: "Master Ricossystems",
      jobTitle: "Administrador Master",
    },
  });

  console.log("MASTER configurado com sucesso.");
  console.log("Email: master@ricossystems.com.br");
  console.log("Senha: 123456");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });