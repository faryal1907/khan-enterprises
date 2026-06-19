import { Controller, Get, Put, Body, UseGuards, Request, Query } from "@nestjs/common";
import { OrderAlertsService } from "./order-alerts.service";
import { GetAlertsDto } from "./dto/get-alerts.dto";
import { MarkAsReadDto } from "./dto/mark-as-read.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("order-alerts")
@UseGuards(JwtAuthGuard)
export class OrderAlertsController {
  constructor(private readonly orderAlertsService: OrderAlertsService) {}

  /**
   * Get alerts for current user
   */
  @Get()
  async getAlerts(@Request() req, @Query() query: GetAlertsDto) {
    return this.orderAlertsService.getAlerts(req.user.id, req.user.role, query);
  }

  /**
   * Get unread alert count for current user
   */
  @Get("unread-count")
  async getUnreadCount(@Request() req) {
    return this.orderAlertsService.getUnreadCount(req.user.id);
  }

  /**
   * Mark an alert as read
   */
  @Put("read")
  async markAsRead(@Request() req, @Body() dto: MarkAsReadDto) {
    return this.orderAlertsService.markAsRead(dto.alertId, req.user.id);
  }
}
