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
var FeedbacksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbacksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const feedback_entity_1 = require("./entities/feedback.entity");
let FeedbacksService = FeedbacksService_1 = class FeedbacksService {
    constructor(feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
        this.logger = new common_1.Logger(FeedbacksService_1.name);
    }
    async create(createFeedbackDto) {
        this.logger.log(`Creating feedback: ${JSON.stringify(createFeedbackDto)}`);
        return {
            id: `feedback-${Date.now()}`,
            customerId: createFeedbackDto.customerId,
            customerName: createFeedbackDto.customerName || "고객명",
            singerId: createFeedbackDto.singerId,
            singerName: createFeedbackDto.singerName,
            rating: createFeedbackDto.rating,
            content: createFeedbackDto.content,
            category: createFeedbackDto.category,
            status: createFeedbackDto.status || "new",
            response: createFeedbackDto.response,
            responseAt: createFeedbackDto.responseAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    async findAll() {
        this.logger.log("Finding all feedbacks");
        return this.feedbackRepository.find();
    }
    async findByCustomerId(customerId) {
        this.logger.log(`Finding feedbacks for customer: ${customerId}`);
        return this.feedbackRepository.find({ where: { customerId } });
    }
    async findBySingerId(singerId) {
        this.logger.log(`Finding feedbacks for singer: ${singerId}`);
        return this.feedbackRepository.find({ where: { singerId } });
    }
    async findOne(id) {
        this.logger.log(`Finding feedback with id: ${id}`);
        const feedback = await this.feedbackRepository.findOne({ where: { id } });
        if (!feedback) {
            throw new common_1.NotFoundException(`Feedback with ID ${id} not found`);
        }
        return feedback;
    }
    async update(id, updateFeedbackDto) {
        this.logger.log(`Updating feedback ${id}: ${JSON.stringify(updateFeedbackDto)}`);
        await this.findOne(id);
        await this.feedbackRepository.update(id, updateFeedbackDto);
        return this.findOne(id);
    }
    async remove(id) {
        this.logger.log(`Removing feedback with id: ${id}`);
        const feedback = await this.findOne(id);
        await this.feedbackRepository.remove(feedback);
    }
    async respond(id, response) {
        this.logger.log(`Adding response to feedback ${id}: ${response}`);
        const updateData = {
            response,
            responseAt: new Date(),
            status: "resolved",
        };
        return this.update(id, updateData);
    }
};
exports.FeedbacksService = FeedbacksService;
exports.FeedbacksService = FeedbacksService = FeedbacksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feedback_entity_1.Feedback)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FeedbacksService);
//# sourceMappingURL=feedbacks.service.js.map