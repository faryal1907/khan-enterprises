import { PartialType } from "@nestjs/mapped-types";
import { CreateBikeModelDto } from "./create-bike-model.dto";

export class UpdateBikeModelDto extends PartialType(CreateBikeModelDto) {}
