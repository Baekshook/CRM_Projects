import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SingersService } from "./singers.service";
import { SingersController } from "./singers.controller";
import { Singer } from "./entities/singer.entity";
import { FilesModule } from "../files/files.module";

@Module({
  imports: [TypeOrmModule.forFeature([Singer]), FilesModule],
  controllers: [SingersController],
  providers: [SingersService],
  exports: [SingersService],
})
export class SingersModule {}
