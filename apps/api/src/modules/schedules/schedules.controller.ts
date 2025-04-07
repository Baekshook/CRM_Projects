import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
} from "@nestjs/common";
import { SchedulesService } from "./schedules.service";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

@Controller("schedules")
export class SchedulesController {
  private readonly logger = new Logger(SchedulesController.name);

  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    this.logger.log(`Creating schedule: ${JSON.stringify(createScheduleDto)}`);
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    this.logger.log(
      `Finding all schedules with query: ${JSON.stringify(query)}`
    );
    return this.schedulesService.findAll(query);
  }

  @Get("/date")
  async findByDate(
    @Query("year") year: number,
    @Query("month") month: number,
    @Query("day") day?: number
  ) {
    this.logger.log(
      `Finding schedules by date: year=${year}, month=${month}, day=${day || "not specified"}`
    );
    return this.schedulesService.findByDate(year, month, day);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    this.logger.log(`Finding schedule with id: ${id}`);
    return this.schedulesService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateScheduleDto: UpdateScheduleDto
  ) {
    this.logger.log(
      `Updating schedule ${id}: ${JSON.stringify(updateScheduleDto)}`
    );
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    this.logger.log(`Removing schedule with id: ${id}`);
    return this.schedulesService.remove(id);
  }
}
