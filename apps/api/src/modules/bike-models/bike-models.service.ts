import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
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

  async createBikeModel(data: CreateBikeModelDto) {
    return this.prisma.client.bikeModel.create({
      data,
    });
  }

  async updateBikeModel(id: string, data: UpdateBikeModelDto) {
    await this.getBikeModelById(id); // Ensure it exists
    return this.prisma.client.bikeModel.update({
      where: { id },
      data,
    });
  }

  async deleteBikeModel(id: string) {
    const model = await this.getBikeModelById(id);

    // Check if any bikes are using this model
    const bikesCount = await this.prisma.client.bikeUnit.count({
      where: { modelId: id },
    });

    if (bikesCount > 0) {
      throw new BadRequestException(
        `Cannot delete bike model "${model.brand} ${model.modelName}" because it is currently assigned to ${bikesCount} bike unit(s).`
      );
    }

    return this.prisma.client.bikeModel.delete({
      where: { id },
    });
  }
}
