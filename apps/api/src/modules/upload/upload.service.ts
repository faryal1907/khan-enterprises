import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

@Injectable()
export class UploadService {
  /**
   * Upload a file buffer to Cloudinary.
   * @param buffer - File buffer
   * @param folder - Cloudinary folder path
   * @param mimeType - File MIME type
   * @returns Object with url, publicId, and other metadata
   */
  async uploadFile(buffer: Buffer, folder: string, mimeType: string): Promise<{
    url: string;
    publicId: string;
  }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: this.getResourceType(mimeType),
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new Error("Upload failed: No result returned"));
          }
        },
      );

      const readable = new Readable();
      readable._read = () => {};
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  /**
   * Delete a file from Cloudinary by public ID.
   * @param publicId - Cloudinary public ID
   */
  async deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Determine Cloudinary resource type based on MIME type.
   * @param mimeType - File MIME type
   * @returns Cloudinary resource type (image, video, or auto)
   */
  private getResourceType(mimeType: string): "image" | "video" | "auto" {
    if (mimeType.startsWith("image/")) {
      return "image";
    }
    if (mimeType.startsWith("video/")) {
      return "video";
    }
    return "auto";
  }

  /**
   * Validate MIME type (PDF and images only).
   * @param mimeType - File MIME type
   * @returns True if valid, false otherwise
   */
  isValidMimeType(mimeType: string): boolean {
    if (!mimeType) return false;
    if (mimeType === "application/pdf") return true;
    if (mimeType.startsWith("image/")) return true;
    if (mimeType.startsWith("video/")) return true;
    return false;
  }

  /**
   * Validate file size (max 50MB).
   * @param size - File size in bytes
   * @returns True if valid, false otherwise
   */
  isValidFileSize(size: number): boolean {
    const maxSize = 50 * 1024 * 1024; // 50MB
    return size <= maxSize;
  }
}
