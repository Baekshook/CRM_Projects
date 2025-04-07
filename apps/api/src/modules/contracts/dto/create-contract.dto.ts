import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
} from "class-validator";

export class CreateContractDto {
  @IsUUID()
  @IsNotEmpty()
  matchId: string;

  @IsUUID()
  @IsNotEmpty()
  scheduleId: string;

  @IsUUID()
  @IsNotEmpty()
  requestId: string;

  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerCompany: string;

  @IsUUID()
  @IsNotEmpty()
  singerId: string;

  @IsString()
  @IsNotEmpty()
  singerName: string;

  @IsString()
  @IsNotEmpty()
  singerAgency: string;

  @IsString()
  @IsNotEmpty()
  eventTitle: string;

  @IsString()
  @IsNotEmpty()
  eventDate: string;

  @IsString()
  @IsNotEmpty()
  venue: string;

  @IsString()
  @IsNotEmpty()
  contractAmount: string;

  @IsEnum(["unpaid", "partial", "paid"])
  @IsOptional()
  paymentStatus?: "unpaid" | "partial" | "paid" = "unpaid";

  @IsEnum(["draft", "sent", "signed", "completed", "cancelled"])
  @IsOptional()
  contractStatus?: "draft" | "sent" | "signed" | "completed" | "cancelled" =
    "draft";
}
