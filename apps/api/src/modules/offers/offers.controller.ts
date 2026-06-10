import { Controller, Get, Post, Query, Param, Body, UseGuards } from "@nestjs/common";
import { OffersService } from "./offers.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { CounterOfferDto } from "./dto/counter-offer.dto";
import { RejectOfferDto } from "./dto/reject-offer.dto";
import { QueryOffersDto } from "./dto/query-offers.dto";

@Controller("offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  /**
   * POST /api/offers
   * Public (no auth) — customer submits offer
   */
  @Post()
  async createOffer(@Body() dto: CreateOfferDto) {
    return this.offersService.createOffer(dto);
  }

  /**
   * GET /api/offers
   * @Roles(ADMIN, MANAGER, SALES_STAFF)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER", "SALES_STAFF")
  async getOffers(@Query() query: QueryOffersDto) {
    return this.offersService.getOffers(query);
  }

  /**
   * GET /api/offers/customer/:userId
   * @UseGuards(JwtAuthGuard) — get all offers for a logged-in customer by user ID
   * NOTE: Must be defined before :id to avoid route conflicts
   */
  @Get("customer/:userId")
  @UseGuards(JwtAuthGuard)
  async getOffersByCustomer(@Param("userId") userId: string, @Query() query: QueryOffersDto) {
    return this.offersService.getOffersByCustomer(userId, query);
  }

  /**
   * GET /api/offers/bike/:bikeId
   * Public — negotiation history for a bike
   * NOTE: Must be defined before :id to avoid route conflicts
   */
  @Get("bike/:bikeId")
  async getOffersByBike(@Param("bikeId") bikeId: string) {
    return this.offersService.getOffersByBike(bikeId);
  }

  /**
   * GET /api/offers/:id
   * Public (no auth) — customers can view their offer by ID
   */
  @Get(":id")
  async getOfferById(@Param("id") id: string) {
    return this.offersService.getOfferById(id);
  }

  /**
   * POST /api/offers/:id/accept
   * @Roles(ADMIN, MANAGER)
   */
  @Post(":id/accept")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async acceptOffer(@Param("id") id: string, @CurrentUser() user: any) {
    return this.offersService.acceptOffer(id, user.id);
  }

  /**
   * POST /api/offers/:id/reject
   * @Roles(ADMIN, MANAGER)
   */
  @Post(":id/reject")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async rejectOffer(
    @Param("id") id: string,
    @Body() dto: RejectOfferDto,
    @CurrentUser() user: any,
  ) {
    return this.offersService.rejectOffer(id, dto, user.id);
  }

  /**
   * POST /api/offers/:id/counter
   * @Roles(ADMIN, MANAGER)
   */
  @Post(":id/counter")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async counterOffer(
    @Param("id") id: string,
    @Body() dto: CounterOfferDto,
    @CurrentUser() user: any,
  ) {
    return this.offersService.counterOffer(id, dto, user.id);
  }

  /**
   * POST /api/offers/:id/accept-counter
   * Public (no auth) — customer accepts counter
   */
  @Post(":id/accept-counter")
  async acceptCounter(@Param("id") id: string, @Body() body: { paymentMethod?: string }) {
    return this.offersService.acceptCounter(id, body.paymentMethod);
  }

  /**
   * POST /api/offers/:id/reject-counter
   * Public (no auth) — customer rejects counter
   */
  @Post(":id/reject-counter")
  async rejectCounter(@Param("id") id: string, @Body() body: { message?: string }) {
    return this.offersService.rejectCounterOffer(id, body.message);
  }

  /**
   * POST /api/offers/:id/cancel
   * Public (no auth) — customer cancels overall offer
   */
  @Post(":id/cancel")
  async cancelOffer(@Param("id") id: string) {
    return this.offersService.cancelOffer(id);
  }
}
