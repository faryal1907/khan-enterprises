import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { BikeModelsService } from "./bike-models.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreateBikeModelDto } from "./dto/create-bike-model.dto";
import { UpdateBikeModelDto } from "./dto/update-bike-model.dto";

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

  /**
   * GET /api/bike-models/:id
   * Returns a specific bike model.
   */
  @Get(":id")
  async getBikeModelById(@Param("id") id: string) {
    const bikeModel = await this.bikeModelsService.getBikeModelById(id);
    return { bikeModel };
  }

  /**
   * POST /api/bike-models
   * Create a new bike model.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async createBikeModel(
    @Body() data: CreateBikeModelDto,
    @CurrentUser() user: any
  ) {
    const bikeModel = await this.bikeModelsService.createBikeModel(data, user);
    return { bikeModel };
  }

  /**
   * PUT /api/bike-models/:id
   * Update an existing bike model.
   */
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async updateBikeModel(
    @Param("id") id: string,
    @Body() data: UpdateBikeModelDto,
    @CurrentUser() user: any
  ) {
    const bikeModel = await this.bikeModelsService.updateBikeModel(id, data, user);
    return { bikeModel };
  }

  /**
   * DELETE /api/bike-models/:id
   * Delete a bike model if not associated with any bikes.
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBikeModel(
    @Param("id") id: string,
    @CurrentUser() user: any
  ) {
    await this.bikeModelsService.deleteBikeModel(id, user);
  }
}

