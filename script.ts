import { PrismaClient } from "@khan/prisma";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "fkali.bscs23seecs@seecs.edu.pk" }
  });
  console.log("User:", user);
}

main().catch(console.error).finally(() => prisma.$disconnect());
