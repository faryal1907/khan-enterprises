import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { CounterOfferDto } from "./dto/counter-offer.dto";
import { RejectOfferDto } from "./dto/reject-offer.dto";
import { QueryOffersDto } from "./dto/query-offers.dto";
import { OfferStatus, BikeStatus, OrderStatus, PaymentMethod, AuditAction } from "@khan/prisma";
import { generateOrderNumber } from "../../common/utils";

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create offer, verify bike is AVAILABLE, set expiresAt = now + 48h, status PENDING
   */
  async createOffer(dto: CreateOfferDto, userId?: string) {
    // Verify bike exists and is AVAILABLE
    const bike = await this.prisma.client.bikeUnit.findUnique({
      where: { id: dto.bikeId },
    });

    if (!bike) {
      throw new NotFoundException(`Bike with ID ${dto.bikeId} not found`);
    }

    if (bike.status !== BikeStatus.AVAILABLE) {
      throw new BadRequestException(`Bike is not available for offer. Current status: ${bike.status}`);
    }

    // Set expiresAt to 48 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    return this.prisma.client.offer.create({
      data: {
        bikeId: dto.bikeId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        customerCNIC: dto.customerCNIC,
        customerAddress: dto.customerAddress,
        offerAmount: dto.offerAmount,
        message: dto.message,
        status: OfferStatus.PENDING,
        expiresAt,
        paymentMethod: dto.paymentMethod,
        createdById: userId,
      },
      include: {
        bike: {
          include: {
            model: true,
            branch: true,
          },
        },
      },
    });
  }

  /**
   * Paginated list with filters on status, bikeId. Include bike + model info
   * By default excludes ACCEPTED offers (converted to orders) unless includeConverted=true
   */
  async getOffers(query: QueryOffersDto) {
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    } else if (!query.includeConverted) {
      // By default, exclude ACCEPTED offers (they've been converted to orders)
      where.status = { not: OfferStatus.ACCEPTED };
    }

    if (query.bikeId) {
      where.bikeId = query.bikeId;
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [offers, total] = await Promise.all([
      this.prisma.client.offer.findMany({
        where,
        skip,
        take: limit,
        include: {
          bike: {
            include: {
              model: true,
              branch: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.client.offer.count({ where }),
    ]);

    return {
      offers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Single offer with bike, createdBy, linked order
   */
  async getOfferById(id: string) {
    const offer = await this.prisma.client.offer.findUnique({
      where: { id },
      include: {
        bike: {
          include: {
            model: true,
            branch: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        order: true,
      },
    });

    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    return offer;
  }

  /**
   * Critical path — atomic transaction: set offer → ACCEPTED, bike → RESERVED,
   * reservedUntil = now + 24h, create Order record
   */
  async acceptOffer(id: string, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Fetch offer, verify status === PENDING or COUNTERED
      const offer = await tx.offer.findUnique({
        where: { id },
      });

      if (!offer) {
        throw new NotFoundException(`Offer with ID ${id} not found`);
      }

      if (offer.status !== OfferStatus.PENDING && offer.status !== OfferStatus.COUNTERED) {
        throw new BadRequestException(`Offer cannot be accepted. Current status: ${offer.status}`);
      }

      // 2. Fetch bike, verify status === AVAILABLE (re-check inside tx, prevents race condition)
      const bike = await tx.bikeUnit.findUnique({
        where: { id: offer.bikeId },
      });

      if (!bike) {
        throw new NotFoundException(`Bike with ID ${offer.bikeId} not found`);
      }

      if (bike.status !== BikeStatus.AVAILABLE) {
        throw new BadRequestException(`Bike is not available. Current status: ${bike.status}`);
      }

      // 3. Update offer: status → ACCEPTED
      const updatedOffer = await tx.offer.update({
        where: { id },
        data: {
          status: OfferStatus.ACCEPTED,
        },
      });

      // 4. Update bike: status → RESERVED, reservedUntil = now + 24h
      const reservedUntil = new Date();
      reservedUntil.setHours(reservedUntil.getHours() + 24);

      const updatedBike = await tx.bikeUnit.update({
        where: { id: offer.bikeId },
        data: {
          status: BikeStatus.RESERVED,
          reservedUntil,
        },
      });

      // 5. Create Order
      const orderNumber = generateOrderNumber();
      const negotiatedAmount = offer.counterAmount || offer.offerAmount;
      
      // Set expiresAt to 1 week from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const order = await tx.order.create({
        data: {
          orderNumber,
          bikeId: offer.bikeId,
          offerId: offer.id,
          branchId: bike.branchId,
          customerName: offer.customerName,
          customerPhone: offer.customerPhone,
          customerCNIC: offer.customerCNIC || "",
          customerAddress: offer.customerAddress || "",
          negotiatedAmount,
          paymentMethod: offer.paymentMethod || PaymentMethod.CASH,
          status: OrderStatus.PENDING_PAYMENT,
          expiresAt,
          processedById: user.id,
        },
      });

      // 6. Create Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.APPROVE,
          entityType: "OFFER",
          entityId: id,
          oldValue: JSON.stringify({ status: offer.status }),
          newValue: JSON.stringify({ status: OfferStatus.ACCEPTED }),
        },
      });

      // 7. Return { offer, bike, order }
      return {
        offer: updatedOffer,
        bike: updatedBike,
        order,
      };
    });
  }

  /**
   * Set offer → REJECTED, store adminResponse
   */
  async rejectOffer(id: string, dto: RejectOfferDto, user: any) {
    const offer = await this.getOfferById(id);

    if (offer.status !== OfferStatus.PENDING && offer.status !== OfferStatus.COUNTERED) {
      throw new BadRequestException(`Offer cannot be rejected. Current status: ${offer.status}`);
    }

    return this.prisma.client.$transaction(async (tx) => {
      const rejectedOffer = await tx.offer.update({
        where: { id },
        data: {
          status: OfferStatus.REJECTED,
          adminResponse: dto.adminResponse,
        },
        include: {
          bike: {
            include: {
              model: true,
              branch: true,
            },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.REJECT,
          entityType: "OFFER",
          entityId: id,
          oldValue: JSON.stringify({ status: offer.status }),
          newValue: JSON.stringify({ status: OfferStatus.REJECTED, adminResponse: dto.adminResponse }),
        },
      });

      return rejectedOffer;
    });
  }

  /**
   * Set offer → COUNTERED, store counterAmount + adminResponse, reset expiresAt = now + 48h
   */
  async counterOffer(id: string, dto: CounterOfferDto, user: any) {
    const offer = await this.getOfferById(id);

    if (offer.status !== OfferStatus.PENDING) {
      throw new BadRequestException(`Offer cannot be countered. Current status: ${offer.status}`);
    }

    // Reset expiresAt to 48 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    return this.prisma.client.$transaction(async (tx) => {
      const counteredOffer = await tx.offer.update({
        where: { id },
        data: {
          status: OfferStatus.COUNTERED,
          counterAmount: dto.counterAmount,
          adminResponse: dto.adminResponse,
          expiresAt,
        },
        include: {
          bike: {
            include: {
              model: true,
              branch: true,
            },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "OFFER",
          entityId: id,
          oldValue: JSON.stringify({ status: offer.status }),
          newValue: JSON.stringify({ status: OfferStatus.COUNTERED, counterAmount: dto.counterAmount }),
        },
      });

      return counteredOffer;
    });
  }

  /**
   * Customer accepts the counter — set offer → ACCEPTED, run same atomic reservation + order creation as acceptOffer
   */
  async acceptCounter(id: string, paymentMethod?: string) {
    // This is essentially the same as acceptOffer but without adminId
    // We'll use a system user ID or null for processedById
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Fetch offer, verify status === COUNTERED
      const offer = await tx.offer.findUnique({
        where: { id },
      });

      if (!offer) {
        throw new NotFoundException(`Offer with ID ${id} not found`);
      }

      if (offer.status !== OfferStatus.COUNTERED) {
        throw new BadRequestException(`Counter offer cannot be accepted. Current status: ${offer.status}`);
      }

      // 2. Fetch bike, verify status === AVAILABLE (re-check inside tx, prevents race condition)
      const bike = await tx.bikeUnit.findUnique({
        where: { id: offer.bikeId },
      });

      if (!bike) {
        throw new NotFoundException(`Bike with ID ${offer.bikeId} not found`);
      }

      if (bike.status !== BikeStatus.AVAILABLE) {
        throw new BadRequestException(`Bike is not available. Current status: ${bike.status}`);
      }

      // 3. Update offer: status → ACCEPTED
      const updatedOffer = await tx.offer.update({
        where: { id },
        data: {
          status: OfferStatus.ACCEPTED,
        },
      });

      // 4. Update bike: status → RESERVED, reservedUntil = now + 24h
      const reservedUntil = new Date();
      reservedUntil.setHours(reservedUntil.getHours() + 24);

      const updatedBike = await tx.bikeUnit.update({
        where: { id: offer.bikeId },
        data: {
          status: BikeStatus.RESERVED,
          reservedUntil,
        },
      });

      // 5. Create Order (without processedById since customer is accepting)
      const orderNumber = generateOrderNumber();
      const negotiatedAmount = offer.counterAmount || offer.offerAmount;
      
      // Set expiresAt to 1 week from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const order = await tx.order.create({
        data: {
          orderNumber,
          bikeId: offer.bikeId,
          offerId: offer.id,
          branchId: bike.branchId,
          customerName: offer.customerName,
          customerPhone: offer.customerPhone,
          customerCNIC: offer.customerCNIC || "",
          customerAddress: offer.customerAddress || "",
          negotiatedAmount,
          paymentMethod: (paymentMethod as PaymentMethod) || PaymentMethod.CASH,
          status: OrderStatus.PENDING_PAYMENT,
          expiresAt,
          processedById: null,
        },
      });

      // 6. Return { offer, bike, order }
      return {
        offer: updatedOffer,
        bike: updatedBike,
        order,
      };
    });
  }

  /**
   * Full negotiation history for a specific bike
   */
  async getOffersByBike(bikeId: string) {
    // Verify bike exists
    const bike = await this.prisma.client.bikeUnit.findUnique({
      where: { id: bikeId },
    });

    if (!bike) {
      throw new NotFoundException(`Bike with ID ${bikeId} not found`);
    }

    return this.prisma.client.offer.findMany({
      where: { bikeId },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get all offers for a customer by user ID
   * Also includes offers created by the same customer phone/email for backward compatibility
   */
  async getOffersByCustomer(userId: string, query: QueryOffersDto) {
    // First get the user to find their phone/email
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { phoneNumber: true, email: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Query offers by createdById OR customer phone/email
    const where: any = {
      OR: [
        { createdById: userId },
      ],
    };

    // Add phone/email matching if available
    if (user.phoneNumber) {
      where.OR.push({ customerPhone: user.phoneNumber });
    }
    if (user.email) {
      where.OR.push({ customerEmail: user.email });
    }

    if (query.status) {
      where.status = query.status;
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [offers, total] = await Promise.all([
      this.prisma.client.offer.findMany({
        where,
        skip,
        take: limit,
        include: {
          bike: {
            include: {
              model: true,
              branch: true,
            },
          },
          order: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.client.offer.count({ where }),
    ]);

    return {
      offers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Customer rejects counter offer — set offer → REJECTED
   */
  async rejectCounterOffer(id: string, message?: string) {
    const offer = await this.getOfferById(id);

    if (offer.status !== OfferStatus.COUNTERED) {
      throw new BadRequestException(`Counter offer cannot be rejected. Current status: ${offer.status}`);
    }

    return this.prisma.client.offer.update({
      where: { id },
      data: {
        status: OfferStatus.REJECTED,
        message: message || offer.message,
      },
      include: {
        bike: {
          include: {
            model: true,
            branch: true,
          },
        },
      },
    });
  }

  /**
   * Customer cancels their overall offer — set offer → REJECTED
   */
  async cancelOffer(id: string) {
    const offer = await this.getOfferById(id);

    if (offer.status !== OfferStatus.PENDING && offer.status !== OfferStatus.COUNTERED) {
      throw new BadRequestException(`Offer cannot be cancelled. Current status: ${offer.status}`);
    }

    return this.prisma.client.offer.update({
      where: { id },
      data: {
        status: OfferStatus.REJECTED,
      },
      include: {
        bike: {
          include: {
            model: true,
            branch: true,
          },
        },
      },
    });
  }

}
