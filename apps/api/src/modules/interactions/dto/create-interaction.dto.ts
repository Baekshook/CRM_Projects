import {
  IsString,
  IsOptional,
  IsUUID,
  IsObject,
  IsDateString,
  IsIn,
} from "class-validator";

export class CreateInteractionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  type: string; // 'call', 'email', 'meeting', 'note', etc.

  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  contactName?: string;

  @IsString()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsDateString()
  @IsOptional()
  interactionDate?: Date;

  @IsString()
  @IsIn(["pending", "completed", "follow-up"])
  @IsOptional()
  status?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
