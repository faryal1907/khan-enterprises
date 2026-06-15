import { Controller, Get, Post, Patch, Query, Param, Body, UseGuards, NotFoundException, Res } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { QueryOrdersDto } from "./dto/query-orders.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { CompleteOrderDetailsDto } from "./dto/complete-order-details.dto";
import { RecordPaymentDto } from "./dto/record-payment.dto";
import { CreateManualOrderDto } from "./dto/create-manual-order.dto";
import { PdfService } from "../pdf/pdf.service";
import { Response } from "express";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly pdfService: PdfService
  ) {}

  /**
   * GET /api/orders/number/:orderNumber
   * Protected endpoint for customer order status lookup
   * Customers can only view their own orders
   * NOTE: Must be defined before GET /orders/:id
   */
  @Get("number/:orderNumber")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async getOrderByNumber(@Param("orderNumber") orderNumber: string, @CurrentUser() user: any) {
    return this.ordersService.getOrderByNumber(orderNumber, user);
  }

  /**
   * GET /api/orders/customer/:phone
   * Protected endpoint for customers to lookup their orders by phone number
   * Customers can only lookup their own orders
   */
  @Get("customer/:phone")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async getOrdersByCustomerPhone(@Param("phone") phone: string, @CurrentUser() user: any) {
    // For CUSTOMER role, verify phone matches their own
    if (user?.role === "CUSTOMER" && phone !== user.phoneNumber) {
      throw new NotFoundException("Orders not found");
    }
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
   * PATCH /api/orders/:id/complete-details
   * @Roles(ADMIN, MANAGER, SALES_STAFF, CUSTOMER)
   */
  @Patch(":id/complete-details")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async completeOrderDetails(
    @Param("id") id: string,
    @Body() dto: CompleteOrderDetailsDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.completeOrderDetails(id, dto, user);
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
    return this.ordersService.updateOrderStatus(id, dto, user);
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
    return this.ordersService.cancelOrder(id, dto, user);
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
    @Body() dto: RecordPaymentDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.recordPayment(id, dto, user);
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

  /**
   * POST /api/orders/manual
   * @Roles(ADMIN, MANAGER, SALES_STAFF)
   */
  @Post("manual")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF")
  async createManualOrder(
    @Body() dto: CreateManualOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.createManualOrder(dto, user);
  }

  /**
   * GET /api/orders/:id/invoice
   * @Roles(ADMIN, MANAGER, SALES_STAFF, CUSTOMER)
   */
  @Get(":id/invoice")
  @UseGuards(JwtAuthGuard)
  async downloadInvoice(@Param("id") id: string, @Res() res: Response) {
    const order = await this.ordersService.getOrderById(id);
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    const pdfStream = this.pdfService.generateInvoice(order);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
    });

    pdfStream.pipe(res);
  }
}
