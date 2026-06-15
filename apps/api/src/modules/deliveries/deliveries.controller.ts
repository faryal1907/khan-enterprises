import { Controller, Get, Post, Patch, Query, Param, Body, UseGuards } from "@nestjs/common";
import { DeliveriesService } from "./deliveries.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { QueryDeliveriesDto } from "./dto/query-deliveries.dto";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { UpdateDeliveryStatusDto } from "./dto/update-delivery-status.dto";

@Controller("deliveries")
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  /**
   * POST /api/deliveries/order/:orderId
   * @Roles(CUSTOMER)
   * Create delivery request for a confirmed order
   */
  @Post("order/:orderId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("CUSTOMER")
  async createDeliveryRequest(
    @Param("orderId") orderId: string,
    @Body() dto: CreateDeliveryDto,
    @Query("orderType") orderType: "BIKE" | "PART" = "BIKE",
    @CurrentUser() user: any
  ) {
    return this.deliveriesService.createDeliveryRequest(orderId, dto, orderType);
  }

  /**
   * GET /api/deliveries
   * @Roles(ADMIN, MANAGER, SALES_STAFF, CUSTOMER)
   * Get all delivery requests with filtering
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async getDeliveries(@Query() query: QueryDeliveriesDto, @CurrentUser() user: any) {
    return this.deliveriesService.getDeliveries(query, user);
  }

  /**
   * GET /api/deliveries/stats
   * @Roles(ADMIN, MANAGER)
   * Get delivery statistics for dashboard
   */
  @Get("stats")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async getDeliveryStats(@Query("branchId") branchId?: string) {
    return this.deliveriesService.getDeliveryStats(branchId);
  }

  /**
   * GET /api/deliveries/:id
   * @Roles(ADMIN, MANAGER, SALES_STAFF, CUSTOMER)
   * Get delivery request by ID with full details
   */
  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async getDeliveryById(@Param("id") id: string) {
    return this.deliveriesService.getDeliveryById(id);
  }

  /**
   * GET /api/deliveries/order/:orderId
   * @Roles(ADMIN, MANAGER, SALES_STAFF, CUSTOMER)
   * Get delivery request by order ID
   */
  @Get("order/:orderId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async getDeliveryByOrderId(
    @Param("orderId") orderId: string,
    @Query("orderType") orderType: "BIKE" | "PART" = "BIKE"
  ) {
    return this.deliveriesService.getDeliveryByOrderId(orderId, orderType);
  }

  /**
   * PATCH /api/deliveries/:id/status
   * @Roles(ADMIN, MANAGER)
   * Update delivery status through valid state transitions
   */
  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async updateDeliveryStatus(
    @Param("id") id: string,
    @Body() dto: UpdateDeliveryStatusDto,
    @CurrentUser() user: any
  ) {
    return this.deliveriesService.updateDeliveryStatus(id, dto, user.id);
  }
}
