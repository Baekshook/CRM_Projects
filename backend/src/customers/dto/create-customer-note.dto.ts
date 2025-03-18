import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateCustomerNoteDto {
  @IsString()
  content: string;

  @IsInt()
  @IsOptional()
  createdById?: number;
}
