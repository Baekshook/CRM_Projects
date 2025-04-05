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
import { NegotiationsService } from "./negotiations.service";
import { CreateNegotiationDto } from "./dto/create-negotiation.dto";
import { UpdateNegotiationDto } from "./dto/update-negotiation.dto";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { CreateNegotiationLogDto } from "./dto/create-negotiation-log.dto";

@Controller("negotiations")
export class NegotiationsController {
  private readonly logger = new Logger(NegotiationsController.name);

  constructor(private readonly negotiationsService: NegotiationsService) {}

  // 협상 관련 엔드포인트
  @Post()
  create(@Body() createNegotiationDto: CreateNegotiationDto) {
    this.logger.log(`Creating new negotiation`);
    return this.negotiationsService.createNegotiation(createNegotiationDto);
  }

  @Get()
  findAll(@Query() query: any) {
    this.logger.log(
      `Finding all negotiations with query: ${JSON.stringify(query)}`
    );
    return this.negotiationsService.findAllNegotiations(query);
  }

  @Get("status/:status")
  findByStatus(@Param("status") status: string) {
    this.logger.log(`Finding negotiations with status: ${status}`);
    return this.negotiationsService.findAllNegotiations({ status });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    this.logger.log(`Finding negotiation with id: ${id}`);
    return this.negotiationsService.findNegotiationById(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateNegotiationDto: UpdateNegotiationDto
  ) {
    this.logger.log(`Updating negotiation with id: ${id}`);
    return this.negotiationsService.updateNegotiation(id, updateNegotiationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    this.logger.log(`Removing negotiation with id: ${id}`);
    return this.negotiationsService.removeNegotiation(id);
  }

  // 견적서 관련 엔드포인트
  @Get(":id/quotes")
  findAllQuotes(@Param("id") negotiationId: string) {
    this.logger.log(`Finding all quotes for negotiation: ${negotiationId}`);
    return this.negotiationsService.findAllQuotes(negotiationId);
  }

  @Post("quotes")
  createQuote(@Body() createQuoteDto: CreateQuoteDto) {
    this.logger.log(`Creating new quote`);
    return this.negotiationsService.createQuote(createQuoteDto);
  }

  @Get("quotes/:id")
  findQuote(@Param("id") id: string) {
    this.logger.log(`Finding quote with id: ${id}`);
    return this.negotiationsService.findQuoteById(id);
  }

  @Patch("quotes/:id")
  updateQuote(@Param("id") id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    this.logger.log(`Updating quote with id: ${id}`);
    return this.negotiationsService.updateQuote(id, updateQuoteDto);
  }

  @Delete("quotes/:id")
  removeQuote(@Param("id") id: string) {
    this.logger.log(`Removing quote with id: ${id}`);
    return this.negotiationsService.removeQuote(id);
  }

  // 협상 로그 관련 엔드포인트
  @Get(":id/logs")
  findAllLogs(@Param("id") negotiationId: string) {
    this.logger.log(`Finding all logs for negotiation: ${negotiationId}`);
    return this.negotiationsService.findAllLogs(negotiationId);
  }

  @Post("logs")
  createLog(@Body() createLogDto: CreateNegotiationLogDto) {
    this.logger.log(`Creating new log`);
    return this.negotiationsService.createLog(createLogDto);
  }
}
