import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("upload")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * POST /upload
   * Accepts multipart/form-data with a file field.
   * Validates MIME type (PDF, images only) and enforces 10MB max size.
   * Uploads to Cloudinary and returns file metadata.
   */
  @Post()
  @Roles("ADMIN", "MANAGER")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    // Validate MIME type
    if (!this.uploadService.isValidMimeType(file.mimetype)) {
      throw new BadRequestException(
        "Invalid file type. Only PDF, images (JPEG, PNG, GIF, WebP), and videos (MP4, WebM, OGG) are allowed.",
      );
    }

    // Validate file size (50MB max)
    if (!this.uploadService.isValidFileSize(file.size)) {
      throw new BadRequestException("File size exceeds 50MB limit");
    }

    try {
      const result = await this.uploadService.uploadFile(
        file.buffer,
        "khan-dealership",
        file.mimetype,
      );

      return {
        fileUrl: result.url,
        publicId: result.publicId,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }
}
