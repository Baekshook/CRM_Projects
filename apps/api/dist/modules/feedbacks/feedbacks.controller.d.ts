import { FeedbacksService } from "./feedbacks.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
export declare class FeedbacksController {
    private readonly feedbacksService;
    private readonly logger;
    constructor(feedbacksService: FeedbacksService);
    create(createFeedbackDto: CreateFeedbackDto): Promise<import("./entities/feedback.entity").Feedback>;
    findAll(customerId?: string, singerId?: string): Promise<import("./entities/feedback.entity").Feedback[]>;
    findOne(id: string): Promise<import("./entities/feedback.entity").Feedback>;
    update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<import("./entities/feedback.entity").Feedback>;
    respond(id: string, response: string): Promise<import("./entities/feedback.entity").Feedback>;
    remove(id: string): Promise<void>;
}
