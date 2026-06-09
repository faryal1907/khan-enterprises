import { IsString, IsNotEmpty, IsInt, IsEnum, Min } from "class-validator";
import { Type } from "class-transformer";
import { FileType } from "@khan/prisma";

export class AttachDocumentDto {
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  fileSize: number;

  @IsEnum(FileType)
  @IsNotEmpty()
  fileType: FileType;
}
