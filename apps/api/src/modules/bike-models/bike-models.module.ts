import { Module } from "@nestjs/common";
import { BikeModelsService } from "./bike-models.service";
import { BikeModelsController } from "./bike-models.controller";

@Module({
  controllers: [BikeModelsController],
  providers: [BikeModelsService],
  exports: [BikeModelsService],
})
export class BikeModelsModule {}
