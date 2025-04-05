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
var NegotiationsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NegotiationsController = void 0;
const common_1 = require("@nestjs/common");
const negotiations_service_1 = require("./negotiations.service");
const create_negotiation_dto_1 = require("./dto/create-negotiation.dto");
const update_negotiation_dto_1 = require("./dto/update-negotiation.dto");
const create_quote_dto_1 = require("./dto/create-quote.dto");
const update_quote_dto_1 = require("./dto/update-quote.dto");
const create_negotiation_log_dto_1 = require("./dto/create-negotiation-log.dto");
let NegotiationsController = NegotiationsController_1 = class NegotiationsController {
    constructor(negotiationsService) {
        this.negotiationsService = negotiationsService;
        this.logger = new common_1.Logger(NegotiationsController_1.name);
    }
    create(createNegotiationDto) {
        this.logger.log(`Creating new negotiation`);
        return this.negotiationsService.createNegotiation(createNegotiationDto);
    }
    findAll(query) {
        this.logger.log(`Finding all negotiations with query: ${JSON.stringify(query)}`);
        return this.negotiationsService.findAllNegotiations(query);
    }
    findByStatus(status) {
        this.logger.log(`Finding negotiations with status: ${status}`);
        return this.negotiationsService.findAllNegotiations({ status });
    }
    findOne(id) {
        this.logger.log(`Finding negotiation with id: ${id}`);
        return this.negotiationsService.findNegotiationById(id);
    }
    update(id, updateNegotiationDto) {
        this.logger.log(`Updating negotiation with id: ${id}`);
        return this.negotiationsService.updateNegotiation(id, updateNegotiationDto);
    }
    remove(id) {
        this.logger.log(`Removing negotiation with id: ${id}`);
        return this.negotiationsService.removeNegotiation(id);
    }
    findAllQuotes(negotiationId) {
        this.logger.log(`Finding all quotes for negotiation: ${negotiationId}`);
        return this.negotiationsService.findAllQuotes(negotiationId);
    }
    createQuote(createQuoteDto) {
        this.logger.log(`Creating new quote`);
        return this.negotiationsService.createQuote(createQuoteDto);
    }
    findQuote(id) {
        this.logger.log(`Finding quote with id: ${id}`);
        return this.negotiationsService.findQuoteById(id);
    }
    updateQuote(id, updateQuoteDto) {
        this.logger.log(`Updating quote with id: ${id}`);
        return this.negotiationsService.updateQuote(id, updateQuoteDto);
    }
    removeQuote(id) {
        this.logger.log(`Removing quote with id: ${id}`);
        return this.negotiationsService.removeQuote(id);
    }
    findAllLogs(negotiationId) {
        this.logger.log(`Finding all logs for negotiation: ${negotiationId}`);
        return this.negotiationsService.findAllLogs(negotiationId);
    }
    createLog(createLogDto) {
        this.logger.log(`Creating new log`);
        return this.negotiationsService.createLog(createLogDto);
    }
};
exports.NegotiationsController = NegotiationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_negotiation_dto_1.CreateNegotiationDto]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("status/:status"),
    __param(0, (0, common_1.Param)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_negotiation_dto_1.UpdateNegotiationDto]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(":id/quotes"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "findAllQuotes", null);
__decorate([
    (0, common_1.Post)("quotes"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_quote_dto_1.CreateQuoteDto]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "createQuote", null);
__decorate([
    (0, common_1.Get)("quotes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "findQuote", null);
__decorate([
    (0, common_1.Patch)("quotes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_quote_dto_1.UpdateQuoteDto]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "updateQuote", null);
__decorate([
    (0, common_1.Delete)("quotes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "removeQuote", null);
__decorate([
    (0, common_1.Get)(":id/logs"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "findAllLogs", null);
__decorate([
    (0, common_1.Post)("logs"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_negotiation_log_dto_1.CreateNegotiationLogDto]),
    __metadata("design:returntype", void 0)
], NegotiationsController.prototype, "createLog", null);
exports.NegotiationsController = NegotiationsController = NegotiationsController_1 = __decorate([
    (0, common_1.Controller)("negotiations"),
    __metadata("design:paramtypes", [negotiations_service_1.NegotiationsService])
], NegotiationsController);
//# sourceMappingURL=negotiations.controller.js.map