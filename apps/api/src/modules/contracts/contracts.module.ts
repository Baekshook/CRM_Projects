import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contract } from "./entities/contract.entity";
import { ContractsController } from "./contracts.controller";
import { ContractsService } from "./contracts.service";
import { StatsController } from "./stats/stats.controller";
import { StatsService } from "./stats/stats.service";

@Module({
  imports: [TypeOrmModule.forFeature([Contract])],
  controllers: [ContractsController, StatsController],
  providers: [ContractsService, StatsService],
  exports: [ContractsService],
})
export class ContractsModule {}
