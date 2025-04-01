import { IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator";

export class CreateFileDto {
  @IsOptional()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsString()
  originalName?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  size?: number;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  data?: Buffer;

  @IsOptional()
  @IsBoolean()
  isStoredInDb?: boolean;
}
