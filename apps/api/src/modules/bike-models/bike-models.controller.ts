import { Controller, Get, UseGuards } from "@nestjs/common";
import { BikeModelsService } from "./bike-models.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("bike-models")
@UseGuards(JwtAuthGuard)
export class BikeModelsController {
  constructor(private readonly bikeModelsService: BikeModelsService) {}

  /**
   * GET /api/bike-models
   * Returns all bike models for dropdown reference.
   */
  @Get()
  async getBikeModels() {
    const bikeModels = await this.bikeModelsService.getAllBikeModels();
    return { count: bikeModels.length, bikeModels };
  }
}
