import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NegotiationLog } from "./entities/negotiation-log.entity";

@Module({
  imports: [TypeOrmModule.forFeature([NegotiationLog])],
  controllers: [],
  providers: [],
  exports: [],
})
export class NegotiationsModule {}
