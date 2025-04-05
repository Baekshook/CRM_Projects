import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from "@nestjs/common";
import { SegmentsService } from "./segments.service";
import { CreateSegmentDto } from "./dto/create-segment.dto";
import { UpdateSegmentDto } from "./dto/update-segment.dto";

@Controller("segments")
export class SegmentsController {
  private readonly logger = new Logger(SegmentsController.name);

  constructor(private readonly segmentsService: SegmentsService) {}

  @Post()
  async create(@Body() createSegmentDto: CreateSegmentDto) {
    this.logger.log(`Creating segment: ${JSON.stringify(createSegmentDto)}`);
    return this.segmentsService.create(createSegmentDto);
  }

  @Get()
  async findAll() {
    this.logger.log("Finding all segments");
    return this.segmentsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    this.logger.log(`Finding segment with id: ${id}`);
    return this.segmentsService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateSegmentDto: UpdateSegmentDto
  ) {
    this.logger.log(
      `Updating segment ${id}: ${JSON.stringify(updateSegmentDto)}`
    );
    return this.segmentsService.update(id, updateSegmentDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    this.logger.log(`Removing segment with id: ${id}`);
    return this.segmentsService.remove(id);
  }
}
