import { Controller, Get, Query, Param } from "@nestjs/common";
import { CatalogService } from "./catalog.service";

@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  /**
   * GET /api/catalog/bikes
   * List available bikes with filters
   * Filters: modelId, priceMin, priceMax, branchId
   * Always returns bikes with status = AVAILABLE
   */
  @Get("bikes")
  async getBikes(
    @Query("modelId") modelId?: string,
    @Query("priceMin") priceMin?: string,
    @Query("priceMax") priceMax?: string,
    @Query("branchId") branchId?: string,
  ) {
    const filters: any = {};
    if (modelId) filters.modelId = modelId;
    if (priceMin) filters.priceMin = parseFloat(priceMin);
    if (priceMax) filters.priceMax = parseFloat(priceMax);
    if (branchId) filters.branchId = branchId;

    return this.catalogService.getBikes(filters);
  }

  /**
   * GET /api/catalog/bikes/:id
   * Get single bike detail with public-safe documents only
   * Only returns documents where fileType = REGISTRATION_DOCUMENT
   */
  @Get("bikes/:id")
  async getBikeById(@Param("id") id: string) {
    return this.catalogService.getBikeById(id);
  }

  /**
   * GET /api/catalog/parts
   * List parts with filters
   * Filters: category, search
   */
  @Get("parts")
  async getParts(
    @Query("category") category?: string,
    @Query("search") search?: string,
    @Query("branchId") branchId?: string,
  ) {
    const filters: any = {};
    if (category) filters.category = category;
    if (search) filters.search = search;
    if (branchId) filters.branchId = branchId;

    return this.catalogService.getParts(filters);
  }

  /**
   * GET /api/catalog/parts/:id
   * Get single part detail with per-branch stock
   */
  @Get("parts/:id")
  async getPartById(@Param("id") id: string) {
    return this.catalogService.getPartById(id);
  }

  /**
   * GET /api/catalog/search
   * Search across bikes (modelName, brand) and parts (name, sku)
   */
  @Get("search")
  async search(@Query("q") query?: string) {
    if (!query) {
      return { bikes: [], parts: [] };
    }

    return this.catalogService.search(query);
  }

  /**
   * GET /api/catalog/models
   * List all bike models
   */
  @Get("models")
  async getModels() {
    return this.catalogService.getModels();
  }

  /**
   * GET /api/catalog/branches
   * List all branches
   */
  @Get("branches")
  async getBranches() {
    return this.catalogService.getBranches();
  }
}
