import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SegmentsService } from "./segments.service";
import { SegmentsController } from "./segments.controller";
import { Segment } from "./segments.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Segment])],
  controllers: [SegmentsController],
  providers: [SegmentsService],
  exports: [SegmentsService],
})
export class SegmentsModule {}
