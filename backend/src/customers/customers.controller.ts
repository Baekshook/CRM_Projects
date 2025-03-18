import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateCustomerNoteDto } from './dto/create-customer-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles('admin', 'manager')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @Roles('admin', 'manager', 'staff')
  findAll(
    @Query('status') status?: string,
    @Query('grade') grade?: string,
    @Query('search') search?: string,
  ) {
    return this.customersService.findAll(status, grade, search);
  }

  @Get(':id')
  @Roles('admin', 'manager', 'staff')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: Partial<CreateCustomerDto>,
  ) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }

  @Patch('status/bulk')
  @Roles('admin', 'manager')
  updateStatus(@Body() data: { ids: number[]; status: 'active' | 'inactive' }) {
    return this.customersService.updateStatus(data.ids, data.status);
  }

  @Post(':id/notes')
  @Roles('admin', 'manager', 'staff')
  addNote(
    @Param('id') id: string,
    @Body() createNoteDto: CreateCustomerNoteDto,
  ) {
    return this.customersService.addNote(+id, createNoteDto);
  }

  @Delete('notes/:id')
  @Roles('admin', 'manager')
  removeNote(@Param('id') id: string) {
    return this.customersService.removeNote(+id);
  }
}
