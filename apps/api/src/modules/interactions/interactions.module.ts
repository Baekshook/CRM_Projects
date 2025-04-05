import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InteractionsService } from "./interactions.service";
import { InteractionsController } from "./interactions.controller";
import { Interaction } from "./interactions.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Interaction])],
  controllers: [InteractionsController],
  providers: [InteractionsService],
  exports: [InteractionsService],
})
export class InteractionsModule {}
