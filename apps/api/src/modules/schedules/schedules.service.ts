import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { Schedule } from "./entities/schedule.entity";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(SchedulesService.name);

  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    try {
      this.logger.log(
        `Creating schedule: ${JSON.stringify(createScheduleDto)}`
      );

      // matchId 처리: 없거나 기본 UUID인 경우 null로 설정
      if (
        !createScheduleDto.matchId ||
        createScheduleDto.matchId === "00000000-0000-0000-0000-000000000000"
      ) {
        createScheduleDto.matchId = null;
      }

      // requestId 처리: 없거나 기본 UUID인 경우 null로 설정
      if (
        !createScheduleDto.requestId ||
        createScheduleDto.requestId === "00000000-0000-0000-0000-000000000000"
      ) {
        createScheduleDto.requestId = null;
      }

      // 날짜 형식 변환
      let scheduledDate: Date;
      try {
        scheduledDate = new Date(createScheduleDto.scheduledDate);
        if (isNaN(scheduledDate.getTime())) {
          throw new BadRequestException(
            "Invalid date format for scheduledDate"
          );
        }
      } catch (error) {
        throw new BadRequestException(
          "Invalid date format for scheduledDate: " + error.message
        );
      }

      // DTO에서 entity로 변환 시 필요한 타입 변환 수행
      const scheduleData = {
        ...createScheduleDto,
        scheduledDate, // Date 객체로 변환하여 검증 후, Entity에 전달시 DB에서 알아서 처리함
      };

      // 필수 필드 확인
      const requiredFields = [
        "customerId",
        "customerName",
        "singerId",
        "singerName",
        "eventTitle",
        "eventDate",
        "venue",
        "location",
        "details",
      ];

      for (const field of requiredFields) {
        if (!scheduleData[field]) {
          throw new BadRequestException(`Missing required field: ${field}`);
        }
      }

      // 빈 문자열 필드 처리
      const stringFields = [
        "customerCompany",
        "singerAgency",
        "description",
        "startTime",
        "endTime",
      ];

      for (const field of stringFields) {
        if (scheduleData[field] === undefined || scheduleData[field] === null) {
          scheduleData[field] = "";
        }
      }

      this.logger.log(
        `Creating schedule with processed data: ${JSON.stringify(scheduleData)}`
      );

      // 엔티티 생성 및 저장
      const schedule = this.schedulesRepository.create(scheduleData);
      return await this.schedulesRepository.save(schedule);
    } catch (error) {
      this.logger.error(
        `Error creating schedule: ${error.message}`,
        error.stack
      );

      // 특정 데이터베이스 오류 처리
      if (error.code === "23505") {
        // PostgreSQL 중복 키 오류 코드
        throw new BadRequestException(
          "A schedule with these details already exists"
        );
      } else if (error.code === "23503") {
        // 외래 키 제약 조건 오류
        let errorMessage = "Foreign key constraint violation.";

        // 오류 메시지에서 관련 정보 추출 시도
        if (error.detail) {
          if (error.detail.includes("customerId")) {
            errorMessage =
              "The specified customer does not exist in the database.";
          } else if (error.detail.includes("singerId")) {
            errorMessage =
              "The specified singer does not exist in the database.";
          } else if (error.detail.includes("matchId")) {
            errorMessage =
              "The specified match does not exist in the database.";
          } else if (error.detail.includes("requestId")) {
            errorMessage =
              "The specified request does not exist in the database.";
          }
        }

        throw new BadRequestException(errorMessage);
      } else if (error instanceof BadRequestException) {
        // 이미 BadRequestException인 경우 그대로 다시 던짐
        throw error;
      } else {
        // 기타 모든 오류는 서버 오류로 처리
        throw new InternalServerErrorException(
          `Failed to create schedule: ${error.message}`
        );
      }
    }
  }

  async findAll(query?: any): Promise<Schedule[]> {
    try {
      const options: any = {
        relations: ["customer", "singer"],
      };

      // 상태 필터링
      if (query && query.status && query.status !== "all") {
        options.where = { ...options.where, status: query.status };
      }

      return await this.schedulesRepository.find(options);
    } catch (error) {
      this.logger.error(
        `Error finding schedules: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException(
        `Failed to retrieve schedules: ${error.message}`
      );
    }
  }

  async findOne(id: string): Promise<Schedule> {
    try {
      const schedule = await this.schedulesRepository.findOne({
        where: { id },
        relations: ["customer", "singer"],
      });

      if (!schedule) {
        throw new NotFoundException(`Schedule with ID "${id}" not found`);
      }

      return schedule;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error finding schedule by id ${id}: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException(
        `Failed to retrieve schedule: ${error.message}`
      );
    }
  }

  async update(
    id: string,
    updateScheduleDto: UpdateScheduleDto
  ): Promise<Schedule> {
    try {
      const schedule = await this.findOne(id);

      // 날짜 필드 처리
      if (updateScheduleDto.scheduledDate) {
        try {
          const scheduledDate = new Date(updateScheduleDto.scheduledDate);
          if (isNaN(scheduledDate.getTime())) {
            throw new BadRequestException(
              "Invalid date format for scheduledDate"
            );
          }
          // Date 객체를 그대로 할당하지 않고 ISO 문자열로 변환하여 할당
          updateScheduleDto.scheduledDate = scheduledDate.toISOString();
        } catch (error) {
          throw new BadRequestException(
            "Invalid date format for scheduledDate: " + error.message
          );
        }
      }

      Object.assign(schedule, updateScheduleDto);
      return await this.schedulesRepository.save(schedule);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Error updating schedule ${id}: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException(
        `Failed to update schedule: ${error.message}`
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.schedulesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Schedule with ID "${id}" not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error removing schedule ${id}: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException(
        `Failed to remove schedule: ${error.message}`
      );
    }
  }

  async findByDate(
    year: number,
    month: number,
    day?: number
  ): Promise<Schedule[]> {
    try {
      // 날짜 범위 설정
      const startDate = new Date(year, month - 1, day || 1);
      let endDate: Date;

      if (day) {
        // 특정 일자의 경우 하루 전체를 범위로 설정
        endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
      } else {
        // 특정 월의 경우 해당 월 전체를 범위로 설정
        endDate = new Date(year, month, 0, 23, 59, 59, 999);
      }

      const schedules = await this.schedulesRepository.find({
        where: {
          scheduledDate: Between(startDate, endDate),
        },
        relations: ["customer", "singer"],
      });

      return schedules;
    } catch (error) {
      this.logger.error(
        `Error finding schedules by date: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException(
        `Failed to retrieve schedules by date: ${error.message}`
      );
    }
  }
}
