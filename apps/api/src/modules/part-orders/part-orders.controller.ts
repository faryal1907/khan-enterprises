import { Controller, Post, Get, Patch, Param, Body, UseGuards, Query } from "@nestjs/common";
import { PartOrdersService } from "./part-orders.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreatePartOrderDto } from "./dto/create-part-order.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { OrderStatus } from "@khan/prisma";

@Controller("part-orders")
export class PartOrdersController {
  constructor(private readonly partOrdersService: PartOrdersService) {}

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
   * GET /api/part-orders
   * Get part orders (paginated, filtered)
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getPartOrders(@Query() query: any, @CurrentUser() user: any) {
    return this.partOrdersService.getPartOrders(query, user);
  }

  /**
   * PATCH /api/part-orders/:id/status
   * Update part order status (admin only)
   */
  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  async updatePartOrderStatus(
    @Param("id") id: string,
    @Body("status") status: OrderStatus,
    @CurrentUser() user: any
  ) {
    return this.partOrdersService.updatePartOrderStatus(id, status, user.id);
  }

  /**
   * PATCH /api/part-orders/:id/cancel
   * Cancel part order (admin only)
   */
  @Patch(":id/cancel")
  @UseGuards(JwtAuthGuard)
  async cancelPartOrder(@Param("id") id: string, @CurrentUser() user: any) {
    return this.partOrdersService.cancelPartOrder(id, user.id);
  }
}
