import { IsOptional, IsString } from "class-validator";

export class SignContractDto {
  @IsString()
  @IsOptional()
  signature?: string;

  @IsString()
  @IsOptional()
  signerName?: string;

  @IsString()
  @IsOptional()
  signerRole?: string;
}
