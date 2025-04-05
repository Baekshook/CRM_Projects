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
var FeedbacksController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbacksController = void 0;
const common_1 = require("@nestjs/common");
const feedbacks_service_1 = require("./feedbacks.service");
const create_feedback_dto_1 = require("./dto/create-feedback.dto");
const update_feedback_dto_1 = require("./dto/update-feedback.dto");
let FeedbacksController = FeedbacksController_1 = class FeedbacksController {
    constructor(feedbacksService) {
        this.feedbacksService = feedbacksService;
        this.logger = new common_1.Logger(FeedbacksController_1.name);
    }
    async create(createFeedbackDto) {
        this.logger.log(`Creating feedback: ${JSON.stringify(createFeedbackDto)}`);
        return this.feedbacksService.create(createFeedbackDto);
    }
    async findAll(customerId, singerId) {
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
    async findOne(id) {
        this.logger.log(`Finding feedback with id: ${id}`);
        return this.feedbacksService.findOne(id);
    }
    async update(id, updateFeedbackDto) {
        this.logger.log(`Updating feedback ${id}: ${JSON.stringify(updateFeedbackDto)}`);
        return this.feedbacksService.update(id, updateFeedbackDto);
    }
    async respond(id, response) {
        this.logger.log(`Adding response to feedback ${id}: ${response}`);
        return this.feedbacksService.respond(id, response);
    }
    async remove(id) {
        this.logger.log(`Removing feedback with id: ${id}`);
        return this.feedbacksService.remove(id);
    }
};
exports.FeedbacksController = FeedbacksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_feedback_dto_1.CreateFeedbackDto]),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("customerId")),
    __param(1, (0, common_1.Query)("singerId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_feedback_dto_1.UpdateFeedbackDto]),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/respond"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("response")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "respond", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbacksController.prototype, "remove", null);
exports.FeedbacksController = FeedbacksController = FeedbacksController_1 = __decorate([
    (0, common_1.Controller)("feedbacks"),
    __metadata("design:paramtypes", [feedbacks_service_1.FeedbacksService])
], FeedbacksController);
//# sourceMappingURL=feedbacks.controller.js.map