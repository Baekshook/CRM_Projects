import { Controller, Get, Param, Query } from "@nestjs/common";
import { StatsService } from "./stats.service";

@Controller("contracts/stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get("monthly")
  getMonthlyStats(@Query("year") year: number) {
    return this.statsService.getMonthlyStats(year);
  }

  @Get("quarterly")
  getQuarterlyStats(@Query("year") year: number) {
    return this.statsService.getQuarterlyStats(year);
  }

  @Get("category")
  getCategoryStats(@Query("year") year: number) {
    return this.statsService.getCategoryStats(year);
  }

  @Get("type")
  getTypeStats(@Query("year") year: number) {
    return this.statsService.getTypeStats(year);
  }

  @Get("top-customers")
  getTopCustomers(@Query("limit") limit: number = 5) {
    return this.statsService.getTopCustomers(limit);
  }

  @Get("top-singers")
  getTopSingers(@Query("limit") limit: number = 5) {
    return this.statsService.getTopSingers(limit);
  }
}
