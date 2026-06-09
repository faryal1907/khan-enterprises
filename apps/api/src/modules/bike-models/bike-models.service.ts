import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

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
      },
      orderBy: [
        { brand: "asc" },
        { modelName: "asc" },
      ],
    });
  }
}
