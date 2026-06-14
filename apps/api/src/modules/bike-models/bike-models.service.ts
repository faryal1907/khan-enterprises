import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
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
    return this.prisma.client.$transaction(async (tx) => {
      const bikeModel = await tx.bikeModel.create({
        data,
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.CREATE,
          entityType: "BIKE_MODEL",
          entityId: bikeModel.id,
          newValue: JSON.stringify(data),
        },
      });

      return bikeModel;
    });
  }

  async updateBikeModel(id: string, data: UpdateBikeModelDto, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      const oldModel = await tx.bikeModel.findUnique({
        where: { id },
      });

      if (!oldModel) {
        throw new NotFoundException(`Bike model with ID ${id} not found`);
      }

      const bikeModel = await tx.bikeModel.update({
        where: { id },
        data,
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "BIKE_MODEL",
          entityId: bikeModel.id,
          oldValue: JSON.stringify(oldModel),
          newValue: JSON.stringify(data),
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
}
