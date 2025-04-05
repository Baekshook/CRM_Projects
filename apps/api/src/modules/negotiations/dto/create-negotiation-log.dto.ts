import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNegotiationLogDto {
  @IsNotEmpty()
  @IsString()
  negotiationId: string;

  @IsOptional()
  @IsString()
  matchId?: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  user: string;
}
