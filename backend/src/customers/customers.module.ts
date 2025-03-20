import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { CustomersController } from './controllers/customers.controller';
import { CustomerService } from './services/customer.service';
import { CustomerGradeService } from './services/customer-grade.service';
import { Customer } from './entities/customer.entity';
import { CustomerNote } from './entities/customer-note.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, CustomerNote]),
    UsersModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomerService, CustomerGradeService],
  exports: [CustomerService],
})
export class CustomersModule {}
