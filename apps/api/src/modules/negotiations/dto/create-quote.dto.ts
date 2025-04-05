import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsArray,
} from "class-validator";
import { QuoteItem } from "../entities/quote.entity";

export class CreateQuoteDto {
  @IsNotEmpty()
  @IsString()
  negotiationId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsEnum(["draft", "sent", "accepted", "rejected", "revised", "final"])
  status?: "draft" | "sent" | "accepted" | "rejected" | "revised" | "final";

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsArray()
  items?: QuoteItem[];

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  discountReason?: string;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsBoolean()
  isFinal?: boolean;
}
