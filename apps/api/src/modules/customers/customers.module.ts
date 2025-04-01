import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersService } from "./customers.service";
import { CustomersController } from "./customers.controller";
import { Customer } from "./entities/customer.entity";
import { FilesModule } from "../files/files.module";

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), FilesModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
