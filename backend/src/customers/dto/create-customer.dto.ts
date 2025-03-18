import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;

  @IsEnum(['일반', 'VIP', 'VVIP'])
  @IsOptional()
  grade?: string;
}
