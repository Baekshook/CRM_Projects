import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Negotiation } from "./entities/negotiation.entity";
import { Quote } from "./entities/quote.entity";
import { NegotiationLog } from "./entities/negotiation-log.entity";
import { CreateNegotiationDto } from "./dto/create-negotiation.dto";
import { UpdateNegotiationDto } from "./dto/update-negotiation.dto";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { CreateNegotiationLogDto } from "./dto/create-negotiation-log.dto";

@Injectable()
export class NegotiationsService {
  private readonly logger = new Logger(NegotiationsService.name);

  constructor(
    @InjectRepository(Negotiation)
    private negotiationsRepository: Repository<Negotiation>,
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
    @InjectRepository(NegotiationLog)
    private logsRepository: Repository<NegotiationLog>
  ) {}

  // 협상 관련 메서드들
  async findAllNegotiations(query?: any): Promise<Negotiation[]> {
    this.logger.log(
      `Finding all negotiations with query: ${JSON.stringify(query || {})}`
    );

    const queryBuilder = this.negotiationsRepository
      .createQueryBuilder("negotiation")
      .leftJoinAndSelect("negotiation.customer", "customer")
      .leftJoinAndSelect("negotiation.singer", "singer");

    if (query?.status) {
      queryBuilder.andWhere("negotiation.status = :status", {
        status: query.status,
      });
    }

    if (query?.customerId) {
      queryBuilder.andWhere("negotiation.customerId = :customerId", {
        customerId: query.customerId,
      });
    }

    if (query?.singerId) {
      queryBuilder.andWhere("negotiation.singerId = :singerId", {
        singerId: query.singerId,
      });
    }

    return queryBuilder.getMany();
  }

  async findNegotiationById(id: string): Promise<Negotiation> {
    this.logger.log(`Finding negotiation with id: ${id}`);

    const negotiation = await this.negotiationsRepository.findOne({
      where: { id },
      relations: ["customer", "singer", "quotes", "logs"],
    });

    if (!negotiation) {
      throw new NotFoundException(`Negotiation with ID ${id} not found`);
    }

    return negotiation;
  }

  async createNegotiation(
    createNegotiationDto: CreateNegotiationDto
  ): Promise<Negotiation> {
    this.logger.log(
      `Creating new negotiation: ${JSON.stringify(createNegotiationDto)}`
    );

    const negotiation =
      this.negotiationsRepository.create(createNegotiationDto);
    return this.negotiationsRepository.save(negotiation);
  }

  async updateNegotiation(
    id: string,
    updateNegotiationDto: UpdateNegotiationDto
  ): Promise<Negotiation> {
    this.logger.log(
      `Updating negotiation with id ${id}: ${JSON.stringify(updateNegotiationDto)}`
    );

    const negotiation = await this.findNegotiationById(id);

    // 상태 변경 기록
    if (
      updateNegotiationDto.status &&
      updateNegotiationDto.status !== negotiation.status
    ) {
      await this.createLog({
        negotiationId: id,
        type: "status_change",
        content: `상태 변경: ${negotiation.status} → ${updateNegotiationDto.status}`,
        user: updateNegotiationDto.updatedBy || "시스템",
        date: new Date().toISOString(),
      });
    }

    Object.assign(negotiation, updateNegotiationDto);
    return this.negotiationsRepository.save(negotiation);
  }

  async removeNegotiation(id: string): Promise<void> {
    this.logger.log(`Removing negotiation with id: ${id}`);

    const negotiation = await this.findNegotiationById(id);
    await this.negotiationsRepository.remove(negotiation);
  }

  // 견적서 관련 메서드들
  async findAllQuotes(negotiationId: string): Promise<Quote[]> {
    this.logger.log(`Finding all quotes for negotiation: ${negotiationId}`);

    return this.quotesRepository.find({
      where: { negotiationId },
      order: { createdAt: "DESC" },
    });
  }

  async findQuoteById(id: string): Promise<Quote> {
    this.logger.log(`Finding quote with id: ${id}`);

    const quote = await this.quotesRepository.findOne({
      where: { id },
      relations: ["negotiation"],
    });

    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }

    return quote;
  }

  async createQuote(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    this.logger.log(`Creating new quote: ${JSON.stringify(createQuoteDto)}`);

    const negotiation = await this.findNegotiationById(
      createQuoteDto.negotiationId
    );
    const quote = this.quotesRepository.create(createQuoteDto);

    // 견적서 생성 로그 기록
    await this.createLog({
      negotiationId: negotiation.id,
      type: "quote_created",
      content: `새 견적서 생성: ${createQuoteDto.amount}원`,
      user: createQuoteDto.createdBy || "시스템",
      date: new Date().toISOString(),
    });

    return this.quotesRepository.save(quote);
  }

  async updateQuote(
    id: string,
    updateQuoteDto: UpdateQuoteDto
  ): Promise<Quote> {
    this.logger.log(
      `Updating quote with id ${id}: ${JSON.stringify(updateQuoteDto)}`
    );

    const quote = await this.findQuoteById(id);

    // 견적서 상태 변경 로그 기록
    if (updateQuoteDto.status && updateQuoteDto.status !== quote.status) {
      await this.createLog({
        negotiationId: quote.negotiationId,
        type: "quote_status_change",
        content: `견적서 상태 변경: ${quote.status} → ${updateQuoteDto.status}`,
        user: updateQuoteDto.updatedBy || "시스템",
        date: new Date().toISOString(),
      });

      // 최종 견적서인 경우 협상 상태 업데이트
      if (updateQuoteDto.status === "final") {
        await this.updateNegotiation(quote.negotiationId, {
          status: "final-quote",
          finalAmount: updateQuoteDto.amount || quote.amount,
        });
      }

      // 견적서가 수락된 경우 협상 상태 업데이트
      if (updateQuoteDto.status === "accepted") {
        await this.updateNegotiation(quote.negotiationId, {
          status: "completed",
          finalAmount: updateQuoteDto.amount || quote.amount,
        });
      }
    }

    Object.assign(quote, updateQuoteDto);
    return this.quotesRepository.save(quote);
  }

  async removeQuote(id: string): Promise<void> {
    this.logger.log(`Removing quote with id: ${id}`);

    const quote = await this.findQuoteById(id);
    await this.quotesRepository.remove(quote);
  }

  // 협상 로그 관련 메서드들
  async findAllLogs(negotiationId: string): Promise<NegotiationLog[]> {
    this.logger.log(`Finding all logs for negotiation: ${negotiationId}`);

    return this.logsRepository.find({
      where: { negotiationId },
      order: { createdAt: "DESC" },
    });
  }

  async createLog(
    createLogDto: CreateNegotiationLogDto
  ): Promise<NegotiationLog> {
    this.logger.log(`Creating new log: ${JSON.stringify(createLogDto)}`);

    const log = this.logsRepository.create(createLogDto);
    return this.logsRepository.save(log);
  }
}
