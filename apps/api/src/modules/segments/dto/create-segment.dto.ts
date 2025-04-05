import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsIn,
} from "class-validator";

export class CreateSegmentDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(["customer", "singer"])
  entityType: string;

  @IsObject()
  @IsOptional()
  criteria?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
