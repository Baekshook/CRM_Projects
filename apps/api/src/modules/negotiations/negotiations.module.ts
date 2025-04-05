import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NegotiationLog } from "./entities/negotiation-log.entity";
import { Negotiation } from "./entities/negotiation.entity";
import { Quote } from "./entities/quote.entity";
import { NegotiationsController } from "./negotiations.controller";
import { NegotiationsService } from "./negotiations.service";

@Module({
  imports: [TypeOrmModule.forFeature([NegotiationLog, Negotiation, Quote])],
  controllers: [NegotiationsController],
  providers: [NegotiationsService],
  exports: [NegotiationsService],
})
export class NegotiationsModule {}
