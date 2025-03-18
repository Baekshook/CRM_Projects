import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @IsEnum(['info', 'success', 'warning', 'error'])
  @IsOptional()
  type?: string;

  @IsInt()
  userId: number;
}
