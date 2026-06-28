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
import { CreateCustomerOrderDto } from "./dto/create-customer-order.dto";
import { UploadPaymentProofDto } from "./dto/upload-payment-proof.dto";
import { VerifyPaymentDto } from "./dto/verify-payment.dto";
import { RevenueQueryDto } from "./dto/revenue-query.dto";
import { PdfService } from "../pdf";
import { Response } from "express";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly pdfService: PdfService
  ) {}

  // =====================================================
  // IMPORTANT: All literal/specific routes MUST be defined
  // BEFORE any parameterized (:id) routes to prevent
  // NestJS from capturing literal paths as :id values.
  // =====================================================

  /**
   * POST /api/orders/create
   * Customer creates an online order directly (no negotiation, auto 2% discount)
   */
  @Post("create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("CUSTOMER")
  async createCustomerOrder(
    @Body() dto: CreateCustomerOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.createCustomerOrder(dto, user);
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
   * POST /api/orders/expire-reservations
   * @Roles(ADMIN, MANAGER)
   * Manually expire reservations that have passed their expiry date
   */
  @Post("expire-reservations")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async expireReservations() {
    return this.ordersService.expireReservations();
  }

  /**
   * GET /api/orders/number/:orderNumber
   * Protected endpoint for customer order status lookup
   * Customers can only view their own orders
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
    return this.ordersService.getOrdersByCustomerPhone(phone, user);
  }

  /**
   * GET /api/orders/pending-verification
   * @Roles(ADMIN, MANAGER)
   * Get orders awaiting payment verification
   */
  @Get("pending-verification")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async getPendingVerificationOrders(@CurrentUser() user: any) {
    return this.ordersService.getPendingVerificationOrders(user);
  }

  /**
   * GET /api/orders/revenue
   * Get revenue summary with filters
   */
  @Get("revenue")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async getRevenueSummary(@Query() query: RevenueQueryDto, @CurrentUser() user: any) {
    return this.ordersService.revenueSummary(query, user);
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

  // =====================================================
  // Parameterized (:id) routes MUST come AFTER all
  // literal routes above.
  // =====================================================

  /**
   * GET /api/orders/:id
   * @Roles(ADMIN, MANAGER, SALES_STAFF, CUSTOMER)
   */
  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async getOrderById(@Param("id") id: string, @CurrentUser() user: any) {
    return this.ordersService.getOrderById(id, user);
  }

  /**
   * GET /api/orders/:id/invoice
   * @Roles(ADMIN, MANAGER, SALES_STAFF, CUSTOMER)
   */
  @Get(":id/invoice")
  @UseGuards(JwtAuthGuard)
  async downloadInvoice(@Param("id") id: string, @CurrentUser() user: any, @Res() res: Response) {
    const order = await this.ordersService.getOrderById(id, user);
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
   * PATCH /api/orders/:id/picked-up
   * @Roles(ADMIN, MANAGER, SALES_STAFF)
   * Mark order as picked up by customer (no delivery)
   */
  @Patch(":id/picked-up")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF")
  async markAsPickedByCustomer(
    @Param("id") id: string,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.markAsPickedByCustomer(id, user);
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
   * POST /api/orders/:id/upload-payment-proof
   * @Roles(ADMIN, MANAGER, SALES_STAFF, CUSTOMER)
   * Upload payment proof image
   */
  @Post(":id/upload-payment-proof")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async uploadPaymentProof(
    @Param("id") id: string,
    @Body() dto: UploadPaymentProofDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.uploadPaymentProof(id, dto, user);
  }

  /**
   * POST /api/orders/:id/verify-payment
   * @Roles(ADMIN, MANAGER)
   * Admin verifies payment
   */
  @Post(":id/verify-payment")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async verifyPayment(
    @Param("id") id: string,
    @Body() dto: VerifyPaymentDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.verifyPayment(id, dto, user);
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
   * POST /api/orders/:id/complete-onsite
   * @Roles(ADMIN, MANAGER, SALES_STAFF)
   * Mark order as completed for onsite purchases
   */
  @Post(":id/complete-onsite")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF")
  async markOrderAsCompletedOnsite(
    @Param("id") id: string,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.markOrderAsCompletedOnsite(id, user);
  }
}
