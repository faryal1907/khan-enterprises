import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.prisma.client.systemSetting.findUnique({
      where: { key },
    });
    return setting?.value || null;
  }

  async getAllSettings(): Promise<Record<string, string>> {
    const settings = await this.prisma.client.systemSetting.findMany();
    return settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async updateSetting(key: string, value: string, user: any) {
    const setting = await this.prisma.client.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    await this.prisma.client.auditLog.create({
      data: {
        userId: user?.id,
        userRole: user?.role,
        action: "UPDATE",
        entityType: "SystemSetting",
        entityId: setting.id,
        newValue: JSON.stringify({ key, value }),
      },
    });

    return setting;
  }
}
