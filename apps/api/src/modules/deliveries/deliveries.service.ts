import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { QueryDeliveriesDto } from "./dto/query-deliveries.dto";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { UpdateDeliveryStatusDto } from "./dto/update-delivery-status.dto";
import { DeliveryStatus, OrderStatus, BikeStatus, AuditAction } from "@khan/prisma";
import { OrderAlertsService } from "../order-alerts/order-alerts.service";

@Injectable()
export class DeliveriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderAlertsService: OrderAlertsService,
  ) {}

  /**
   * Create delivery request for an order or part order
   * Only allowed when order is in CONFIRMED or PAID status
   */
  async createDeliveryRequest(orderId: string, dto: CreateDeliveryDto, orderType: "BIKE" | "PART" = "BIKE") {
    const delivery = await this.prisma.client.$transaction(async (tx) => {
      if (orderType === "BIKE") {
        // 1. Fetch order and verify status
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: {
            bike: {
              include: {
                model: true,
              },
            },
            branch: true,
          },
        });

        if (!order) {
          throw new NotFoundException(`Order with ID ${orderId} not found`);
        }

        if (order.status !== OrderStatus.CONFIRMED && order.status !== OrderStatus.PAID) {
          throw new BadRequestException(
            `Delivery request can only be created for CONFIRMED or PAID orders. Current status: ${order.status}`
          );
        }

        // 2. Check if delivery request already exists
        const existingDelivery = await tx.deliveryRequest.findUnique({
          where: { orderId },
        });

        if (existingDelivery) {
          throw new BadRequestException(
            `Delivery request already exists for this order`
          );
        }

        // 3. Calculate distance (Mock/API)
        let distanceNote = "";
        let calculatedDistance: number | null = null;
        try {
          const branchAddr = order.branch.address + ", " + order.branch.city;
          const distance = await this.calculateDistance(
            branchAddr, 
            dto.deliveryAddress, 
            dto.latitude, 
            dto.longitude,
            (order.branch as any).latitude,
            (order.branch as any).longitude
          );
          calculatedDistance = distance;
          if (distance > 10) {
            distanceNote = `NOTE: Delivery distance is ${distance.toFixed(1)}km (>10km). Delivery charges will be COD and coordinated by the branch.`;
          } else {
            distanceNote = `NOTE: Delivery distance is ${distance.toFixed(1)}km (Free delivery).`;
          }
        } catch (e) {
          distanceNote = "NOTE: Could not calculate distance automatically. Please verify if >10km for COD charges.";
        }

        // 4. Create delivery request
        const delivery = await tx.deliveryRequest.create({
          data: {
            orderId,
            deliveryAddress: dto.deliveryAddress,
            preferredTimeWindow: dto.preferredTimeWindow,
            contactNumber: dto.contactNumber,
            status: DeliveryStatus.REQUESTED,
            notes: distanceNote,
            latitude: dto.latitude,
            longitude: dto.longitude,
            distanceFromBranch: calculatedDistance,
          },
          include: {
            order: {
              include: {
                bike: {
                  include: {
                    model: true,
                  },
                },
                branch: true,
              },
            },
          },
        });
        return delivery;
      } else {

        // PART order handling
        const partOrder = await tx.partOrder.findUnique({
          where: { id: orderId },
          include: {
            part: true,
            branch: true,
          },
        });

        if (!partOrder) {
          throw new NotFoundException(`Part order with ID ${orderId} not found`);
        }

        if (partOrder.status !== OrderStatus.CONFIRMED && partOrder.status !== OrderStatus.PAID) {
          throw new BadRequestException(
            `Delivery request can only be created for CONFIRMED or PAID part orders. Current status: ${partOrder.status}`
          );
        }

        // Check if delivery request already exists
        const existingDelivery = await tx.deliveryRequest.findUnique({
          where: { partOrderId: orderId },
        });

        if (existingDelivery) {
          throw new BadRequestException(
            `Delivery request already exists for this part order`
          );
        }

        // Calculate distance (Mock/API)
        let distanceNote = "";
        let calculatedDistance: number | null = null;
        try {
          const branchAddr = partOrder.branch.address + ", " + partOrder.branch.city;
          const distance = await this.calculateDistance(
            branchAddr, 
            dto.deliveryAddress, 
            dto.latitude, 
            dto.longitude,
            (partOrder.branch as any).latitude,
            (partOrder.branch as any).longitude
          );
          calculatedDistance = distance;
          if (distance > 10) {
            distanceNote = `NOTE: Delivery distance is ${distance.toFixed(1)}km (>10km). Delivery charges will be COD and coordinated by the branch.`;
          } else {
            distanceNote = `NOTE: Delivery distance is ${distance.toFixed(1)}km (Free delivery).`;
          }
        } catch (e) {
          distanceNote = "NOTE: Could not calculate distance automatically. Please verify if >10km for COD charges.";
        }

        // Create delivery request
        const delivery = await tx.deliveryRequest.create({
          data: {
            partOrderId: orderId,
            deliveryAddress: dto.deliveryAddress,
            preferredTimeWindow: dto.preferredTimeWindow,
            contactNumber: dto.contactNumber,
            status: DeliveryStatus.REQUESTED,
            notes: distanceNote,
            latitude: dto.latitude,
            longitude: dto.longitude,
            distanceFromBranch: calculatedDistance,
          },
          include: {
            partOrder: {
              include: {
                part: true,
                branch: true,
              },
            },
          },
        });

        return delivery;
      }
    });

    // Fire notifications after transaction commits so DB reads in
    // createAlertsForDeliveryRequest see the committed delivery record.
    await this.orderAlertsService.createAlertsForDeliveryRequest(delivery.id);

    return delivery;
  }

  /**
   * Get all delivery requests with filtering and pagination
   * For ADMIN/MANAGER: can filter by branch, status, date range
   * For CUSTOMER: only their own deliveries
   */
  async getDeliveries(query: QueryDeliveriesDto, user?: any) {
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.branchId) {
      where.order = {
        branchId: query.branchId,
      };
    }

    if (query.orderId) {
      where.orderId = query.orderId;
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) {
        where.createdAt.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.createdAt.lte = new Date(query.dateTo);
      }
    }

    // Filter by customer for CUSTOMER role
    if (user?.role === "CUSTOMER") {
      where.order = {
        ...where.order,
        OR: [
          { customerId: user.id },
          { customerPhone: user.phoneNumber },
        ],
      };
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [deliveries, total] = await Promise.all([
      this.prisma.client.deliveryRequest.findMany({
        where,
        skip,
        take: limit,
        include: {
          order: {
            include: {
              bike: {
                include: {
                  model: true,
                },
              },
              branch: true,
              processedBy: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          },
          partOrder: {
            include: {
              part: true,
              branch: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.client.deliveryRequest.count({ where }),
    ]);

    return {
      deliveries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get delivery request by ID with full details
   */
  async getDeliveryById(id: string) {
    const delivery = await this.prisma.client.deliveryRequest.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            bike: {
              include: {
                model: true,
              },
            },
            branch: true,
            transactions: true,
            documents: true,
            processedBy: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        partOrder: {
          include: {
            part: true,
            branch: true,
          },
        },
      },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery request with ID ${id} not found`);
    }

    return delivery;
  }

  /**
   * Update delivery status through valid state transitions
   * REQUESTED -> UNDER_REVIEW -> APPROVED -> IN_TRANSIT -> DELIVERED
   */
  async updateDeliveryStatus(
    id: string,
    dto: UpdateDeliveryStatusDto,
    adminId: string
  ) {
    const delivery = await this.getDeliveryById(id);

    const validTransitions: Record<DeliveryStatus, DeliveryStatus[]> = {
      [DeliveryStatus.REQUESTED]: [DeliveryStatus.UNDER_REVIEW, DeliveryStatus.APPROVED],
      [DeliveryStatus.UNDER_REVIEW]: [DeliveryStatus.APPROVED, DeliveryStatus.REQUESTED],
      [DeliveryStatus.APPROVED]: [DeliveryStatus.IN_TRANSIT, DeliveryStatus.UNDER_REVIEW],
      [DeliveryStatus.IN_TRANSIT]: [DeliveryStatus.DELIVERED, DeliveryStatus.APPROVED],
      [DeliveryStatus.DELIVERED]: [],
    };

    const currentStatus = delivery.status as DeliveryStatus;
    const newStatus = dto.status;

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }

    const updatedDelivery = await this.prisma.client.$transaction(async (tx) => {
      const updateData: any = {
        status: newStatus,
      };

      // Set timestamps based on status
      if (newStatus === DeliveryStatus.APPROVED) {
        updateData.approvedAt = new Date();
      }

      if (newStatus === DeliveryStatus.DELIVERED) {
        updateData.deliveredAt = new Date();
      }

      // Save notes if provided
      if (dto.notes) {
        updateData.notes = dto.notes;
      }

      // Save deliveryCost if provided
      if (dto.deliveryCost !== undefined) {
        updateData.deliveryCost = dto.deliveryCost;
      }

      // Update delivery
      const updatedDelivery = await tx.deliveryRequest.update({
        where: { id },
        data: updateData,
        include: {
          order: {
            include: {
              bike: {
                include: {
                  model: true,
                },
              },
              branch: true,
            },
          },
          partOrder: {
            include: {
              part: true,
              branch: true,
            },
          },
        },
      });

      // When admin approves delivery: flip order to READY_FOR_DELIVERY and bike to IN_DELIVERY
      if (newStatus === DeliveryStatus.APPROVED) {
        if (delivery.orderId && delivery.order) {
          await tx.order.update({
            where: { id: delivery.orderId },
            data: {
              status: OrderStatus.READY_FOR_DELIVERY,
              processedById: adminId,
            },
          });

          await tx.bikeUnit.update({
            where: { id: delivery.order.bikeId },
            data: {
              status: BikeStatus.IN_DELIVERY,
            },
          });
        } else if (delivery.partOrderId) {
          await tx.partOrder.update({
            where: { id: delivery.partOrderId },
            data: {
              status: OrderStatus.READY_FOR_DELIVERY,
              processedById: adminId,
            },
          });
        }
      }

      // If delivery is DELIVERED, update order/part order status
      if (newStatus === DeliveryStatus.DELIVERED) {
        if (delivery.orderId && delivery.order) {
          await tx.order.update({
            where: { id: delivery.orderId },
            data: {
              status: OrderStatus.DELIVERED,
              processedById: adminId,
            },
          });

          await tx.bikeUnit.update({
            where: { id: delivery.order.bikeId },
            data: {
              status: BikeStatus.SOLD,
            },
          });
        } else if (delivery.partOrderId) {
          await tx.partOrder.update({
            where: { id: delivery.partOrderId },
            data: {
              status: OrderStatus.DELIVERED,
              processedById: adminId,
            },
          });
        }
      }

      // Create audit log for status change
      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN", // This should come from the actual user
          action: AuditAction.UPDATE,
          entityType: "DeliveryRequest",
          entityId: id,
          oldValue: { status: currentStatus },
          newValue: { status: newStatus, notes: dto.notes },
        },
      });

      return updatedDelivery;
    });

    // AFTER transaction commits, send customer notification
    const customerId = delivery.order?.customerId || delivery.partOrder?.customerId;
    if (customerId && currentStatus !== newStatus) {
      await this.orderAlertsService.createCustomerAlertForDeliveryStatus(
        id,
        customerId,
        newStatus
      );
    }

    return updatedDelivery;
  }

  /**
   * Get delivery by order ID (bike or part order)
   */
  async getDeliveryByOrderId(orderId: string, orderType: "BIKE" | "PART" = "BIKE") {
    const where = orderType === "BIKE" ? { orderId } : { partOrderId: orderId };
    const include = orderType === "BIKE" 
      ? {
          order: {
            include: {
              bike: {
                include: {
                  model: true,
                },
              },
              branch: true,
            },
          },
        }
      : {
          partOrder: {
            include: {
              part: true,
              branch: true,
            },
          },
        };

    const delivery = await this.prisma.client.deliveryRequest.findUnique({
      where,
      include,
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery request for ${orderType.toLowerCase()} order ${orderId} not found`);
    }

    return delivery;
  }

  /**
   * Get delivery statistics for dashboard
   */
  async getDeliveryStats(branchId?: string) {
    const where = branchId
      ? {
          order: {
            branchId,
          },
        }
      : {};

    const [
      total,
      requested,
      underReview,
      approved,
      inTransit,
      delivered,
    ] = await Promise.all([
      this.prisma.client.deliveryRequest.count({ where }),
      this.prisma.client.deliveryRequest.count({
        where: { ...where, status: DeliveryStatus.REQUESTED },
      }),
      this.prisma.client.deliveryRequest.count({
        where: { ...where, status: DeliveryStatus.UNDER_REVIEW },
      }),
      this.prisma.client.deliveryRequest.count({
        where: { ...where, status: DeliveryStatus.APPROVED },
      }),
      this.prisma.client.deliveryRequest.count({
        where: { ...where, status: DeliveryStatus.IN_TRANSIT },
      }),
      this.prisma.client.deliveryRequest.count({
        where: { ...where, status: DeliveryStatus.DELIVERED },
      }),
    ]);

    return {
      total,
      requested,
      underReview,
      approved,
      inTransit,
      delivered,
    };
  }

  /**
   * Helper to calculate distance between two addresses in km.
   * This uses an open routing API (OSRM) as a demonstration.
   */
  async calculateDistance(originAddr: string, destAddr: string, destLat?: number, destLon?: number, branchLat?: number | null, branchLon?: number | null): Promise<number> {
    try {
      // 1. Geocode origin (skip if exact coordinates are provided)
      let lat1 = branchLat;
      let lon1 = branchLon;

      if (!lat1 || !lon1) {
        const originRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(originAddr)}&format=json&limit=1`, { headers: { "User-Agent": "KhanEnterprisesApp/1.0" }});
        const originData = await originRes.json();
        if (!originData || originData.length === 0) throw new Error("Origin not found");
        lat1 = originData[0].lat;
        lon1 = originData[0].lon;
      }

      // 2. Geocode destination (skip if exact coordinates are provided)
      let lat2 = destLat;
      let lon2 = destLon;
      
      if (!lat2 || !lon2) {
        const destRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destAddr)}&format=json&limit=1`, { headers: { "User-Agent": "KhanEnterprisesApp/1.0" }});
        const destData = await destRes.json();
        if (!destData || destData.length === 0) throw new Error("Destination not found");
        lat2 = destData[0].lat;
        lon2 = destData[0].lon;
      }

      // 3. Get route distance using OSRM
      const routeRes = await fetch(`http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`);
      const routeData = await routeRes.json();
      if (routeData.code !== "Ok" || !routeData.routes || routeData.routes.length === 0) {
        throw new Error("Route not found");
      }

      const distanceMeters = routeData.routes[0].distance;
      return distanceMeters / 1000;
    } catch (error) {
      console.error("Failed to calculate distance:", error);
      throw error;
    }
  }
}