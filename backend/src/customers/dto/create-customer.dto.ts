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

  @IsEnum(['신규고객', '단골고객', '우수고객', '최우수고객'])
  @IsOptional()
  grade?: string;
}
