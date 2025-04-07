import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsDateString,
} from "class-validator";

/**
 * 일정 생성에 필요한 데이터 전송 객체
 * @remark scheduledDate는 ISO 형식 문자열로 전달해야 합니다 (예: 2023-01-01T00:00:00.000Z)
 */
export class CreateScheduleDto {
  /**
   * 일정 날짜 (ISO 문자열 형식)
   * @example "2023-01-01T00:00:00.000Z"
   */
  @IsDateString()
  scheduledDate: string;

  /**
   * 장소 위치 (주소)
   */
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  matchId?: string;

  @IsString()
  @IsOptional()
  requestId?: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsOptional()
  customerCompany?: string;

  @IsString()
  @IsNotEmpty()
  singerId: string;

  @IsString()
  @IsNotEmpty()
  singerName: string;

  @IsString()
  @IsOptional()
  singerAgency?: string;

  @IsString()
  @IsNotEmpty()
  eventTitle: string;

  @IsString()
  @IsNotEmpty()
  eventDate: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsNotEmpty()
  venue: string;

  @IsEnum(["scheduled", "in_progress", "completed", "cancelled", "changed"])
  @IsOptional()
  status?: "scheduled" | "in_progress" | "completed" | "cancelled" | "changed" =
    "scheduled";

  @IsString()
  @IsNotEmpty()
  details: string;
}
