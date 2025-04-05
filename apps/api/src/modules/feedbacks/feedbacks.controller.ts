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
import { FeedbacksService } from "./feedbacks.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@Controller("feedbacks")
export class FeedbacksController {
  private readonly logger = new Logger(FeedbacksController.name);

  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    this.logger.log(`Creating feedback: ${JSON.stringify(createFeedbackDto)}`);
    return this.feedbacksService.create(createFeedbackDto);
  }

  @Get()
  async findAll(
    @Query("customerId") customerId?: string,
    @Query("singerId") singerId?: string
  ) {
    if (customerId) {
      this.logger.log(`Finding feedbacks for customer: ${customerId}`);
      return this.feedbacksService.findByCustomerId(customerId);
    }

    if (singerId) {
      this.logger.log(`Finding feedbacks for singer: ${singerId}`);
      return this.feedbacksService.findBySingerId(singerId);
    }

    this.logger.log("Finding all feedbacks");
    return this.feedbacksService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    this.logger.log(`Finding feedback with id: ${id}`);
    return this.feedbacksService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto
  ) {
    this.logger.log(
      `Updating feedback ${id}: ${JSON.stringify(updateFeedbackDto)}`
    );
    return this.feedbacksService.update(id, updateFeedbackDto);
  }

  @Patch(":id/respond")
  async respond(@Param("id") id: string, @Body("response") response: string) {
    this.logger.log(`Adding response to feedback ${id}: ${response}`);
    return this.feedbacksService.respond(id, response);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    this.logger.log(`Removing feedback with id: ${id}`);
    return this.feedbacksService.remove(id);
  }
}
