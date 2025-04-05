import { Repository } from "typeorm";
import { Negotiation } from "./entities/negotiation.entity";
import { Quote } from "./entities/quote.entity";
import { NegotiationLog } from "./entities/negotiation-log.entity";
import { CreateNegotiationDto } from "./dto/create-negotiation.dto";
import { UpdateNegotiationDto } from "./dto/update-negotiation.dto";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { CreateNegotiationLogDto } from "./dto/create-negotiation-log.dto";
export declare class NegotiationsService {
    private negotiationsRepository;
    private quotesRepository;
    private logsRepository;
    private readonly logger;
    constructor(negotiationsRepository: Repository<Negotiation>, quotesRepository: Repository<Quote>, logsRepository: Repository<NegotiationLog>);
    findAllNegotiations(query?: any): Promise<Negotiation[]>;
    findNegotiationById(id: string): Promise<Negotiation>;
    createNegotiation(createNegotiationDto: CreateNegotiationDto): Promise<Negotiation>;
    updateNegotiation(id: string, updateNegotiationDto: UpdateNegotiationDto): Promise<Negotiation>;
    removeNegotiation(id: string): Promise<void>;
    findAllQuotes(negotiationId: string): Promise<Quote[]>;
    findQuoteById(id: string): Promise<Quote>;
    createQuote(createQuoteDto: CreateQuoteDto): Promise<Quote>;
    updateQuote(id: string, updateQuoteDto: UpdateQuoteDto): Promise<Quote>;
    removeQuote(id: string): Promise<void>;
    findAllLogs(negotiationId: string): Promise<NegotiationLog[]>;
    createLog(createLogDto: CreateNegotiationLogDto): Promise<NegotiationLog>;
}
