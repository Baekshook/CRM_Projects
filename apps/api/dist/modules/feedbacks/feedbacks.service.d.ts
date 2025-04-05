import { Repository } from "typeorm";
import { Feedback } from "./entities/feedback.entity";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
export declare class FeedbacksService {
    private readonly feedbackRepository;
    private readonly logger;
    constructor(feedbackRepository: Repository<Feedback>);
    create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback>;
    findAll(): Promise<Feedback[]>;
    findByCustomerId(customerId: string): Promise<Feedback[]>;
    findBySingerId(singerId: string): Promise<Feedback[]>;
    findOne(id: string): Promise<Feedback>;
    update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback>;
    remove(id: string): Promise<void>;
    respond(id: string, response: string): Promise<Feedback>;
}
