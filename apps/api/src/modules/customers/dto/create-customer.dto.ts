import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsEnum(["customer", "singer"])
  type: "customer" | "singer";

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  profileImageId?: string;

  @IsOptional()
  @IsString()
  statusMessage?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => Number(value))
  grade: number;

  @IsOptional()
  @IsString()
  memo?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsNotEmpty()
  @IsEnum(["active", "inactive"])
  status: "active" | "inactive";

  @IsNotEmpty()
  @IsString()
  registrationDate: string;

  @IsOptional()
  @IsString()
  role?: string;
}
