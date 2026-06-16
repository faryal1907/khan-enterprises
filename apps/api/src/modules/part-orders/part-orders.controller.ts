import { Controller, Post, Get, Patch, Param, Body, UseGuards, Query, Res, NotFoundException } from "@nestjs/common";
import { PartOrdersService } from "./part-orders.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CreatePartOrderDto } from "./dto/create-part-order.dto";
import { CreateManualPartOrderDto } from "./dto/create-manual-part-order.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { OrderStatus } from "@khan/prisma";
import { PdfService } from "../pdf/pdf.service";
import { Response } from "express";

@Controller("part-orders")
export class PartOrdersController {
  constructor(
    private readonly partOrdersService: PartOrdersService,
    private readonly pdfService: PdfService
  ) {}

  /**
   * POST /api/part-orders
   * Create a new part order (public endpoint)
   */
  @Post()
  async createPartOrder(@Body() dto: CreatePartOrderDto) {
    return this.partOrdersService.createPartOrder(dto);
  }

  /**
   * GET /api/part-orders/:orderNumber
   * Get part order by order number (public endpoint)
   */
  @Get(":orderNumber")
  async getPartOrderByNumber(@Param("orderNumber") orderNumber: string) {
    return this.partOrdersService.getPartOrderByNumber(orderNumber);
  }

  /**
   * GET /api/part-orders/id/:id
   * Get part order by ID
   */
  @Get("id/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async getPartOrderById(@Param("id") id: string, @CurrentUser() user: any) {
    return this.partOrdersService.getPartOrderById(id, user);
  }

  /**
   * GET /api/part-orders
   * Get part orders (paginated, filtered)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async getPartOrders(@Query() query: any, @CurrentUser() user: any) {
    return this.partOrdersService.getPartOrders(query, user);
  }

  /**
   * PATCH /api/part-orders/:id/status
   * Update part order status (admin only)
   */
  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async updatePartOrderStatus(
    @Param("id") id: string,
    @Body("status") status: OrderStatus,
    @CurrentUser() user: any
  ) {
    return this.partOrdersService.updatePartOrderStatus(id, status, user);
  }

  /**
   * PATCH /api/part-orders/:id/cancel
   * Cancel part order (admin only)
   */
  @Patch(":id/cancel")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async cancelPartOrder(@Param("id") id: string, @CurrentUser() user: any) {
    return this.partOrdersService.cancelPartOrder(id, user);
  }

  /**
   * POST /api/part-orders/manual
   * Create a manual part order (admin only)
   */
  @Post("manual")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF")
  async createManualPartOrder(
    @Body() dto: CreateManualPartOrderDto,
    @CurrentUser() user: any
  ) {
    return this.partOrdersService.createManualPartOrder(dto, user);
  }

  /**
   * GET /api/part-orders/:id/invoice
   * @Roles(ADMIN, MANAGER, SALES_STAFF, CUSTOMER)
   */
  @Get(":id/invoice")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF", "CUSTOMER")
  async downloadInvoice(@Param("id") id: string, @CurrentUser() user: any, @Res() res: Response) {
    const order = await this.partOrdersService.getPartOrderById(id, user);
    if (!order) {
      throw new NotFoundException("Part order not found");
    }

    const pdfStream = this.pdfService.generateInvoice(order);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
    });

    pdfStream.pipe(res);
  }
}
