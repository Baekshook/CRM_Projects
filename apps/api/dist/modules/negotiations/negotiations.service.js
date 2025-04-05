"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NegotiationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NegotiationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const negotiation_entity_1 = require("./entities/negotiation.entity");
const quote_entity_1 = require("./entities/quote.entity");
const negotiation_log_entity_1 = require("./entities/negotiation-log.entity");
let NegotiationsService = NegotiationsService_1 = class NegotiationsService {
    constructor(negotiationsRepository, quotesRepository, logsRepository) {
        this.negotiationsRepository = negotiationsRepository;
        this.quotesRepository = quotesRepository;
        this.logsRepository = logsRepository;
        this.logger = new common_1.Logger(NegotiationsService_1.name);
    }
    async findAllNegotiations(query) {
        this.logger.log(`Finding all negotiations with query: ${JSON.stringify(query || {})}`);
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
    async findNegotiationById(id) {
        this.logger.log(`Finding negotiation with id: ${id}`);
        const negotiation = await this.negotiationsRepository.findOne({
            where: { id },
            relations: ["customer", "singer", "quotes", "logs"],
        });
        if (!negotiation) {
            throw new common_1.NotFoundException(`Negotiation with ID ${id} not found`);
        }
        return negotiation;
    }
    async createNegotiation(createNegotiationDto) {
        this.logger.log(`Creating new negotiation: ${JSON.stringify(createNegotiationDto)}`);
        const negotiation = this.negotiationsRepository.create(createNegotiationDto);
        return this.negotiationsRepository.save(negotiation);
    }
    async updateNegotiation(id, updateNegotiationDto) {
        this.logger.log(`Updating negotiation with id ${id}: ${JSON.stringify(updateNegotiationDto)}`);
        const negotiation = await this.findNegotiationById(id);
        if (updateNegotiationDto.status &&
            updateNegotiationDto.status !== negotiation.status) {
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
    async removeNegotiation(id) {
        this.logger.log(`Removing negotiation with id: ${id}`);
        const negotiation = await this.findNegotiationById(id);
        await this.negotiationsRepository.remove(negotiation);
    }
    async findAllQuotes(negotiationId) {
        this.logger.log(`Finding all quotes for negotiation: ${negotiationId}`);
        return this.quotesRepository.find({
            where: { negotiationId },
            order: { createdAt: "DESC" },
        });
    }
    async findQuoteById(id) {
        this.logger.log(`Finding quote with id: ${id}`);
        const quote = await this.quotesRepository.findOne({
            where: { id },
            relations: ["negotiation"],
        });
        if (!quote) {
            throw new common_1.NotFoundException(`Quote with ID ${id} not found`);
        }
        return quote;
    }
    async createQuote(createQuoteDto) {
        this.logger.log(`Creating new quote: ${JSON.stringify(createQuoteDto)}`);
        const negotiation = await this.findNegotiationById(createQuoteDto.negotiationId);
        const quote = this.quotesRepository.create(createQuoteDto);
        await this.createLog({
            negotiationId: negotiation.id,
            type: "quote_created",
            content: `새 견적서 생성: ${createQuoteDto.amount}원`,
            user: createQuoteDto.createdBy || "시스템",
            date: new Date().toISOString(),
        });
        return this.quotesRepository.save(quote);
    }
    async updateQuote(id, updateQuoteDto) {
        this.logger.log(`Updating quote with id ${id}: ${JSON.stringify(updateQuoteDto)}`);
        const quote = await this.findQuoteById(id);
        if (updateQuoteDto.status && updateQuoteDto.status !== quote.status) {
            await this.createLog({
                negotiationId: quote.negotiationId,
                type: "quote_status_change",
                content: `견적서 상태 변경: ${quote.status} → ${updateQuoteDto.status}`,
                user: updateQuoteDto.updatedBy || "시스템",
                date: new Date().toISOString(),
            });
            if (updateQuoteDto.status === "final") {
                await this.updateNegotiation(quote.negotiationId, {
                    status: "final-quote",
                    finalAmount: updateQuoteDto.amount || quote.amount,
                });
            }
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
    async removeQuote(id) {
        this.logger.log(`Removing quote with id: ${id}`);
        const quote = await this.findQuoteById(id);
        await this.quotesRepository.remove(quote);
    }
    async findAllLogs(negotiationId) {
        this.logger.log(`Finding all logs for negotiation: ${negotiationId}`);
        return this.logsRepository.find({
            where: { negotiationId },
            order: { createdAt: "DESC" },
        });
    }
    async createLog(createLogDto) {
        this.logger.log(`Creating new log: ${JSON.stringify(createLogDto)}`);
        const log = this.logsRepository.create(createLogDto);
        return this.logsRepository.save(log);
    }
};
exports.NegotiationsService = NegotiationsService;
exports.NegotiationsService = NegotiationsService = NegotiationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(negotiation_entity_1.Negotiation)),
    __param(1, (0, typeorm_1.InjectRepository)(quote_entity_1.Quote)),
    __param(2, (0, typeorm_1.InjectRepository)(negotiation_log_entity_1.NegotiationLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NegotiationsService);
//# sourceMappingURL=negotiations.service.js.map