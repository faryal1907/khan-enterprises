import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditAction } from "@khan/prisma";
import { CreateBikeModelDto } from "./dto/create-bike-model.dto";
import { UpdateBikeModelDto } from "./dto/update-bike-model.dto";

@Injectable()
export class BikeModelsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Return all bike models for dropdown reference.
   */
  async getAllBikeModels() {
    return this.prisma.client.bikeModel.findMany({
      select: {
        id: true,
        brand: true,
        modelName: true,
        year: true,
        engineCapacity: true,
        color: true,
        basePrice: true,
        description: true,
      },
      orderBy: [
        { brand: "asc" },
        { modelName: "asc" },
      ],
    });
  }

  async getBikeModelById(id: string) {
    const model = await this.prisma.client.bikeModel.findUnique({
      where: { id },
    });

    if (!model) {
      throw new NotFoundException(`Bike model with ID ${id} not found`);
    }

    return model;
  }

  async createBikeModel(data: CreateBikeModelDto, user: any) {
    const normalizedData = {
      ...data,
      brand: data.brand.trim(),
      modelName: data.modelName.trim(),
      engineCapacity: data.engineCapacity?.trim() || undefined,
      color: data.color?.trim() || undefined,
      description: data.description?.trim() || undefined,
    };
    await this.assertUniqueModel(normalizedData.brand, normalizedData.modelName, normalizedData.year);
    return this.prisma.client.$transaction(async (tx) => {
      const bikeModel = await tx.bikeModel.create({
        data: normalizedData,
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.CREATE,
          entityType: "BIKE_MODEL",
          entityId: bikeModel.id,
          newValue: JSON.stringify(normalizedData),
        },
      });

      return bikeModel;
    });
  }

  async updateBikeModel(id: string, data: UpdateBikeModelDto, user: any) {
    const oldModel = await this.getBikeModelById(id);
    const normalizedData = {
      ...data,
      ...(data.brand !== undefined && { brand: data.brand.trim() }),
      ...(data.modelName !== undefined && { modelName: data.modelName.trim() }),
      ...(data.engineCapacity !== undefined && { engineCapacity: data.engineCapacity.trim() || undefined }),
      ...(data.color !== undefined && { color: data.color.trim() || undefined }),
      ...(data.description !== undefined && { description: data.description.trim() || undefined }),
    };
    await this.assertUniqueModel(
      normalizedData.brand ?? oldModel.brand,
      normalizedData.modelName ?? oldModel.modelName,
      normalizedData.year ?? oldModel.year,
      id,
    );

    return this.prisma.client.$transaction(async (tx) => {
      const bikeModel = await tx.bikeModel.update({
        where: { id },
        data: normalizedData,
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "BIKE_MODEL",
          entityId: bikeModel.id,
          oldValue: JSON.stringify(oldModel),
          newValue: JSON.stringify(normalizedData),
        },
      });

      return bikeModel;
    });
  }

  async deleteBikeModel(id: string, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      const oldModel = await tx.bikeModel.findUnique({
        where: { id },
      });

      if (!oldModel) {
        throw new NotFoundException(`Bike model with ID ${id} not found`);
      }

      // Check if any bikes are using this model
      const bikesCount = await tx.bikeUnit.count({
        where: { modelId: id },
      });

      if (bikesCount > 0) {
        throw new BadRequestException(
          `Cannot delete bike model "${oldModel.brand} ${oldModel.modelName}" because it is currently assigned to ${bikesCount} bike unit(s).`
        );
      }

      const deletedModel = await tx.bikeModel.delete({
        where: { id },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.DELETE,
          entityType: "BIKE_MODEL",
          entityId: id,
          oldValue: JSON.stringify(oldModel),
        },
      });

      return deletedModel;
    });
  }

  private async assertUniqueModel(brand: string, modelName: string, year: number, excludeId?: string) {
    const existing = await this.prisma.client.bikeModel.findFirst({
      where: {
        brand: { equals: brand.trim(), mode: "insensitive" },
        modelName: { equals: modelName.trim(), mode: "insensitive" },
        year,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (existing) {
      throw new ConflictException(`${brand} ${modelName} (${year}) already exists.`);
    }
  }
}
