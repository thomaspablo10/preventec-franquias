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
  const adminEmail = "admin@preventecfranquias.com.br";
  const adminPassword = "Admin@123456";
  const passwordHash = await hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Administrador Inicial",
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
      publicName: "Administrador Inicial",
      jobTitle: "Equipe Preventec",
    },
    create: {
      name: "Administrador Inicial",
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
      publicName: "Administrador Inicial",
      jobTitle: "Equipe Preventec",
    },
  });

  console.log("Admin inicial configurado com sucesso.");
  console.log(`Email: ${adminEmail}`);
  console.log(`Senha: ${adminPassword}`);
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