import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  @IsOptional()
  status?: string;

  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: string;

  @IsInt()
  customerId: number;

  @IsInt()
  @IsOptional()
  assignedToId?: number;
}
