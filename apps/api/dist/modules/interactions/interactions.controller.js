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
var InteractionsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionsController = void 0;
const common_1 = require("@nestjs/common");
const interactions_service_1 = require("./interactions.service");
const create_interaction_dto_1 = require("./dto/create-interaction.dto");
const update_interaction_dto_1 = require("./dto/update-interaction.dto");
let InteractionsController = InteractionsController_1 = class InteractionsController {
    constructor(interactionsService) {
        this.interactionsService = interactionsService;
        this.logger = new common_1.Logger(InteractionsController_1.name);
    }
    async create(createInteractionDto) {
        this.logger.log(`Creating interaction: ${JSON.stringify(createInteractionDto)}`);
        return this.interactionsService.create(createInteractionDto);
    }
    async findAll(customerId) {
        if (customerId) {
            this.logger.log(`Finding interactions for customer: ${customerId}`);
            return this.interactionsService.findByCustomerId(customerId);
        }
        this.logger.log("Finding all interactions");
        return this.interactionsService.findAll();
    }
    async findOne(id) {
        this.logger.log(`Finding interaction with id: ${id}`);
        return this.interactionsService.findOne(id);
    }
    async update(id, updateInteractionDto) {
        this.logger.log(`Updating interaction ${id}: ${JSON.stringify(updateInteractionDto)}`);
        return this.interactionsService.update(id, updateInteractionDto);
    }
    async remove(id) {
        this.logger.log(`Removing interaction with id: ${id}`);
        return this.interactionsService.remove(id);
    }
};
exports.InteractionsController = InteractionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_interaction_dto_1.CreateInteractionDto]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("customerId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_interaction_dto_1.UpdateInteractionDto]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "remove", null);
exports.InteractionsController = InteractionsController = InteractionsController_1 = __decorate([
    (0, common_1.Controller)("interactions"),
    __metadata("design:paramtypes", [interactions_service_1.InteractionsService])
], InteractionsController);
//# sourceMappingURL=interactions.controller.js.map