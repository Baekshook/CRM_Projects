import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  Logger,
} from "@nestjs/common";
import { ContractsService } from "./contracts.service";

@Controller("contracts")
export class ContractsController {
  private readonly logger = new Logger(ContractsController.name);

  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  async findAll() {
    this.logger.log("Finding all contracts");
    return this.contractsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    this.logger.log(`Finding contract with id: ${id}`);
    return this.contractsService.findOne(id);
  }

  @Post()
  async create(@Body() createContractDto: any) {
    this.logger.log(`Creating contract: ${JSON.stringify(createContractDto)}`);
    return this.contractsService.create(createContractDto);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateContractDto: any) {
    this.logger.log(
      `Updating contract ${id}: ${JSON.stringify(updateContractDto)}`
    );
    return this.contractsService.update(id, updateContractDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    this.logger.log(`Removing contract with id: ${id}`);
    return this.contractsService.remove(id);
  }

  // 통계 API 엔드포인트
  @Get("stats/monthly")
  async getMonthlyStats() {
    this.logger.log("Getting monthly contract stats");
    return this.contractsService.getMonthlyStats();
  }

  @Get("stats/category")
  async getCategoryStats() {
    this.logger.log("Getting category contract stats");
    return this.contractsService.getCategoryStats();
  }

  @Get("stats/type")
  async getTypeStats() {
    this.logger.log("Getting type contract stats");
    return this.contractsService.getTypeStats();
  }

  @Get("stats/quarterly")
  async getQuarterlyStats() {
    this.logger.log("Getting quarterly contract stats");
    return this.contractsService.getQuarterlyStats();
  }

  @Get("stats/top-customers")
  async getTopCustomers(@Query("limit") limit: number = 5) {
    this.logger.log(`Getting top ${limit} customers by contract amount`);
    return this.contractsService.getTopCustomers(limit);
  }

  @Get("stats/top-singers")
  async getTopSingers(@Query("limit") limit: number = 5) {
    this.logger.log(`Getting top ${limit} singers by contract amount`);
    return this.contractsService.getTopSingers(limit);
  }
}
