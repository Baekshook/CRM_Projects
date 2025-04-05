import { NegotiationsService } from "./negotiations.service";
import { CreateNegotiationDto } from "./dto/create-negotiation.dto";
import { UpdateNegotiationDto } from "./dto/update-negotiation.dto";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { CreateNegotiationLogDto } from "./dto/create-negotiation-log.dto";
export declare class NegotiationsController {
    private readonly negotiationsService;
    private readonly logger;
    constructor(negotiationsService: NegotiationsService);
    create(createNegotiationDto: CreateNegotiationDto): Promise<import("./entities/negotiation.entity").Negotiation>;
    findAll(query: any): Promise<import("./entities/negotiation.entity").Negotiation[]>;
    findByStatus(status: string): Promise<import("./entities/negotiation.entity").Negotiation[]>;
    findOne(id: string): Promise<import("./entities/negotiation.entity").Negotiation>;
    update(id: string, updateNegotiationDto: UpdateNegotiationDto): Promise<import("./entities/negotiation.entity").Negotiation>;
    remove(id: string): Promise<void>;
    findAllQuotes(negotiationId: string): Promise<import("./entities/quote.entity").Quote[]>;
    createQuote(createQuoteDto: CreateQuoteDto): Promise<import("./entities/quote.entity").Quote>;
    findQuote(id: string): Promise<import("./entities/quote.entity").Quote>;
    updateQuote(id: string, updateQuoteDto: UpdateQuoteDto): Promise<import("./entities/quote.entity").Quote>;
    removeQuote(id: string): Promise<void>;
    findAllLogs(negotiationId: string): Promise<import("./entities/negotiation-log.entity").NegotiationLog[]>;
    createLog(createLogDto: CreateNegotiationLogDto): Promise<import("./entities/negotiation-log.entity").NegotiationLog>;
}
