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
var ContractsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsController = void 0;
const common_1 = require("@nestjs/common");
const contracts_service_1 = require("./contracts.service");
const create_contract_dto_1 = require("./dto/create-contract.dto");
const update_contract_dto_1 = require("./dto/update-contract.dto");
const sign_contract_dto_1 = require("./dto/sign-contract.dto");
let ContractsController = ContractsController_1 = class ContractsController {
    constructor(contractsService) {
        this.contractsService = contractsService;
        this.logger = new common_1.Logger(ContractsController_1.name);
    }
    async findAll(query) {
        this.logger.log(`Finding all contracts with query: ${JSON.stringify(query)}`);
        return this.contractsService.findAll(query);
    }
    async findOne(id) {
        this.logger.log(`Finding contract with id: ${id}`);
        return this.contractsService.findOne(id);
    }
    async create(createContractDto) {
        this.logger.log(`Creating contract: ${JSON.stringify(createContractDto)}`);
        return this.contractsService.create(createContractDto);
    }
    async update(id, updateContractDto) {
        this.logger.log(`Updating contract ${id}: ${JSON.stringify(updateContractDto)}`);
        return this.contractsService.update(id, updateContractDto);
    }
    async remove(id) {
        this.logger.log(`Removing contract with id: ${id}`);
        return this.contractsService.remove(id);
    }
    async sign(id, signContractDto) {
        this.logger.log(`Signing contract with id: ${id}`);
        return this.contractsService.sign(id, signContractDto);
    }
    async getMonthlyStats() {
        this.logger.log("Getting monthly contract stats");
        return this.contractsService.getMonthlyStats();
    }
    async getCategoryStats() {
        this.logger.log("Getting category contract stats");
        return this.contractsService.getCategoryStats();
    }
    async getTypeStats() {
        this.logger.log("Getting type contract stats");
        return this.contractsService.getTypeStats();
    }
    async getQuarterlyStats() {
        this.logger.log("Getting quarterly contract stats");
        return this.contractsService.getQuarterlyStats();
    }
    async getTopCustomers(limit = 5) {
        this.logger.log(`Getting top ${limit} customers by contract amount`);
        return this.contractsService.getTopCustomers(limit);
    }
    async getTopSingers(limit = 5) {
        this.logger.log(`Getting top ${limit} singers by contract amount`);
        return this.contractsService.getTopSingers(limit);
    }
};
exports.ContractsController = ContractsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contract_dto_1.CreateContractDto]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_contract_dto_1.UpdateContractDto]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/sign"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sign_contract_dto_1.SignContractDto]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "sign", null);
__decorate([
    (0, common_1.Get)("stats/monthly"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getMonthlyStats", null);
__decorate([
    (0, common_1.Get)("stats/category"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getCategoryStats", null);
__decorate([
    (0, common_1.Get)("stats/type"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getTypeStats", null);
__decorate([
    (0, common_1.Get)("stats/quarterly"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getQuarterlyStats", null);
__decorate([
    (0, common_1.Get)("stats/top-customers"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getTopCustomers", null);
__decorate([
    (0, common_1.Get)("stats/top-singers"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getTopSingers", null);
exports.ContractsController = ContractsController = ContractsController_1 = __decorate([
    (0, common_1.Controller)("contracts"),
    __metadata("design:paramtypes", [contracts_service_1.ContractsService])
], ContractsController);
//# sourceMappingURL=contracts.controller.js.map