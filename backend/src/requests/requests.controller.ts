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
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @Roles('admin', 'manager', 'staff')
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(createRequestDto);
  }

  @Get()
  @Roles('admin', 'manager', 'staff')
  findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('customerId') customerId?: string,
    @Query('assignedToId') assignedToId?: string,
  ) {
    return this.requestsService.findAll(
      status,
      priority,
      customerId ? +customerId : undefined,
      assignedToId ? +assignedToId : undefined,
    );
  }

  @Get(':id')
  @Roles('admin', 'manager', 'staff')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'manager', 'staff')
  update(
    @Param('id') id: string,
    @Body() updateRequestDto: Partial<CreateRequestDto>,
  ) {
    return this.requestsService.update(+id, updateRequestDto);
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(+id);
  }

  @Patch(':id/assign/:userId')
  @Roles('admin', 'manager')
  assignUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.requestsService.assignUser(+id, +userId);
  }

  @Patch(':id/status/:status')
  @Roles('admin', 'manager', 'staff')
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.requestsService.updateStatus(+id, status);
  }
}
