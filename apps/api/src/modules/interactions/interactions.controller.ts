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
import { InteractionsService } from "./interactions.service";
import { CreateInteractionDto } from "./dto/create-interaction.dto";
import { UpdateInteractionDto } from "./dto/update-interaction.dto";

@Controller("interactions")
export class InteractionsController {
  private readonly logger = new Logger(InteractionsController.name);

  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  async create(@Body() createInteractionDto: CreateInteractionDto) {
    this.logger.log(
      `Creating interaction: ${JSON.stringify(createInteractionDto)}`
    );
    return this.interactionsService.create(createInteractionDto);
  }

  @Get()
  async findAll(@Query("customerId") customerId: string) {
    if (customerId) {
      this.logger.log(`Finding interactions for customer: ${customerId}`);
      return this.interactionsService.findByCustomerId(customerId);
    }

    this.logger.log("Finding all interactions");
    return this.interactionsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    this.logger.log(`Finding interaction with id: ${id}`);
    return this.interactionsService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateInteractionDto: UpdateInteractionDto
  ) {
    this.logger.log(
      `Updating interaction ${id}: ${JSON.stringify(updateInteractionDto)}`
    );
    return this.interactionsService.update(id, updateInteractionDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    this.logger.log(`Removing interaction with id: ${id}`);
    return this.interactionsService.remove(id);
  }
}
