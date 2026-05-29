import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { prisma } from "@khan/prisma";

/**
 * PrismaService wraps the shared @khan/prisma singleton client.
 * Injected globally via PrismaModule so every service can access the DB.
 */
@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly client = prisma;

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
