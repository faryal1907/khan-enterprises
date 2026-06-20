import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { CounterOfferDto } from "./dto/counter-offer.dto";
import { RejectOfferDto } from "./dto/reject-offer.dto";
import { QueryOffersDto } from "./dto/query-offers.dto";
import { AuditAction } from "@khan/prisma";

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  private isAssignedBranchUser(user?: any) {
    return user?.role !== "ADMIN" && user?.role !== "CUSTOMER" && Boolean(user?.branchId);
  }

  private assertOfferAccess(offer: { bike?: { branchId: string } | null }, user?: any) {
    if (this.isAssignedBranchUser(user) && offer.bike?.branchId !== user.branchId) {
      throw new NotFoundException("Offer not found");
    }
  }

  private getReservationExpiry() {
    const reservedUntil = new Date();
    reservedUntil.setHours(reservedUntil.getHours() + 48);
    return reservedUntil;
  }

  /**
   * Offers/negotiation feature has been removed.
   * This module is kept for backward compatibility and returns placeholder results.
   * Online orders now receive automatic 2% discount instead.
   */

  async createOffer(dto: CreateOfferDto, userId?: string) {
    throw new BadRequestException("Offers are no longer supported. Online orders receive automatic 2% discount.");
  }

  async getOffers(query: QueryOffersDto) {
    return {
      offers: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };
  }

  async getOfferById(id: string) {
    throw new NotFoundException(`Offer with ID ${id} not found`);
  }

  async acceptOffer(id: string, user: any) {
    throw new BadRequestException("Offers are no longer supported.");
  }

  async rejectOffer(id: string, dto: RejectOfferDto, user: any) {
    throw new BadRequestException("Offers are no longer supported.");
  }

  async counterOffer(id: string, dto: CounterOfferDto, user: any) {
    throw new BadRequestException("Counter offers are no longer supported.");
  }

  async acceptCounter(id: string, paymentMethod?: string) {
    throw new BadRequestException("Counter offers are no longer supported.");
  }

  async getOffersByBike(bikeId: string) {
    return [];
  }

  async getOffersByCustomer(userId: string, query: QueryOffersDto) {
    return {
      offers: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };
  }

  async rejectCounterOffer(id: string, message?: string) {
    throw new BadRequestException("Counter offers are no longer supported.");
  }

  async cancelOffer(id: string) {
    throw new BadRequestException("Offers are no longer supported.");
  }
}