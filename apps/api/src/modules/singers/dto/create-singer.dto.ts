import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateSingerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  agency: string;

  @IsNotEmpty()
  @IsString()
  genre: string;

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

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => Number(value))
  grade: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsNotEmpty()
  @IsEnum(["active", "inactive"])
  status: "active" | "inactive";

  @IsNotEmpty()
  @IsString()
  registrationDate: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsOptional()
  @IsInt()
  experience?: number;

  @IsOptional()
  @IsInt()
  price?: number;
}
