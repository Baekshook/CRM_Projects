import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../common/decorators/user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles('admin', 'manager')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @Roles('admin', 'manager', 'staff')
  findAllForUser(@User() user) {
    return this.notificationsService.findAllForUser(user.id);
  }

  @Get('unread')
  @Roles('admin', 'manager', 'staff')
  findUnreadForUser(@User() user) {
    return this.notificationsService.findUnreadForUser(user.id);
  }

  @Post(':id/read')
  @Roles('admin', 'manager', 'staff')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }

  @Post('read-all')
  @Roles('admin', 'manager', 'staff')
  markAllAsRead(@User() user) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @Roles('admin', 'manager', 'staff')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
