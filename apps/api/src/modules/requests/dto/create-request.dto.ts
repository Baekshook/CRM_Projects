import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsString()
  customerCompany: string;

  @IsNotEmpty()
  @IsString()
  eventType: string;

  @IsNotEmpty()
  @IsString()
  eventDate: string;

  @IsNotEmpty()
  @IsString()
  venue: string;

  @IsNotEmpty()
  @IsString()
  budget: string;

  @IsNotEmpty()
  @IsString()
  requirements: string;

  @IsNotEmpty()
  @IsEnum(["pending", "in_progress", "completed", "cancelled"])
  status: "pending" | "in_progress" | "completed" | "cancelled";

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  eventTime: string;

  @IsOptional()
  @IsString()
  singerId?: string;

  @IsOptional()
  @IsString()
  singerName?: string;
}
