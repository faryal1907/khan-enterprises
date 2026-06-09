import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class VendorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Return all vendors for dropdown reference.
   */
  async getAllVendors() {
    return this.prisma.client.vendor.findMany({
      select: {
        id: true,
        name: true,
        contactPerson: true,
        phoneNumber: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });
  }
}
