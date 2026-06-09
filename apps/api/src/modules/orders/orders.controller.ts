import { Controller, Get, Post, Patch, Query, Param, Body, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { QueryOrdersDto } from "./dto/query-orders.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { CompleteOrderDetailsDto } from "./dto/complete-order-details.dto";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * GET /api/orders/number/:orderNumber
   * Public endpoint for customer order status lookup
   * NOTE: Must be defined before GET /orders/:id
   */
  @Get("number/:orderNumber")
  async getOrderByNumber(@Param("orderNumber") orderNumber: string) {
    return this.ordersService.getOrderByNumber(orderNumber);
  }

  /**
   * GET /api/orders/customer/:phone
   * Public endpoint for customers to lookup their orders by phone number
   */
  @Get("customer/:phone")
  async getOrdersByCustomerPhone(@Param("phone") phone: string) {
    return this.ordersService.getOrdersByCustomerPhone(phone);
  }

  /**
   * GET /api/orders
   * @Roles(ADMIN, MANAGER, SALES_STAFF, CUSTOMER)
   * For CUSTOMER: filters by customer phone/CNIC from user profile
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async getOrders(@Query() query: QueryOrdersDto, @CurrentUser() user: any) {
    return this.ordersService.getOrders(query, user);
  }

  /**
   * GET /api/orders/:id
   * @Roles(ADMIN, MANAGER, SALES_STAFF)
   */
  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF")
  async getOrderById(@Param("id") id: string) {
    return this.ordersService.getOrderById(id);
  }

  /**
   * PATCH /api/orders/:id/status
   * @Roles(ADMIN, MANAGER)
   */
  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async updateOrderStatus(
    @Param("id") id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.updateOrderStatus(id, dto, user.id);
  }

  /**
   * POST /api/orders/:id/cancel
   * @Roles(ADMIN, MANAGER)
   */
  @Post(":id/cancel")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async cancelOrder(
    @Param("id") id: string,
    @Body() dto: CancelOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.cancelOrder(id, dto, user.id);
  }

  /**
   * POST /api/orders/:id/payment
   * @Roles(ADMIN, MANAGER, SALES_STAFF)
   */
  @Post(":id/payment")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF")
  async recordPayment(
    @Param("id") id: string,
    @Body() dto: CompleteOrderDetailsDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.recordPayment(id, dto, user.id);
  }

  /**
   * GET /api/orders/branch/:branchId
   * @Roles(ADMIN, MANAGER)
   */
  @Get("branch/:branchId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async getOrdersByBranch(@Param("branchId") branchId: string) {
    return this.ordersService.getOrdersByBranch(branchId);
  }
}
