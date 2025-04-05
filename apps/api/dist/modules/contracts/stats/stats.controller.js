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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const common_1 = require("@nestjs/common");
const stats_service_1 = require("./stats.service");
let StatsController = class StatsController {
    constructor(statsService) {
        this.statsService = statsService;
    }
    getMonthlyStats(year) {
        return this.statsService.getMonthlyStats(year);
    }
    getQuarterlyStats(year) {
        return this.statsService.getQuarterlyStats(year);
    }
    getCategoryStats(year) {
        return this.statsService.getCategoryStats(year);
    }
    getTypeStats(year) {
        return this.statsService.getTypeStats(year);
    }
    getTopCustomers(limit = 5) {
        return this.statsService.getTopCustomers(limit);
    }
    getTopSingers(limit = 5) {
        return this.statsService.getTopSingers(limit);
    }
};
exports.StatsController = StatsController;
__decorate([
    (0, common_1.Get)("monthly"),
    __param(0, (0, common_1.Query)("year")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getMonthlyStats", null);
__decorate([
    (0, common_1.Get)("quarterly"),
    __param(0, (0, common_1.Query)("year")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getQuarterlyStats", null);
__decorate([
    (0, common_1.Get)("category"),
    __param(0, (0, common_1.Query)("year")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getCategoryStats", null);
__decorate([
    (0, common_1.Get)("type"),
    __param(0, (0, common_1.Query)("year")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getTypeStats", null);
__decorate([
    (0, common_1.Get)("top-customers"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getTopCustomers", null);
__decorate([
    (0, common_1.Get)("top-singers"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getTopSingers", null);
exports.StatsController = StatsController = __decorate([
    (0, common_1.Controller)("contracts/stats"),
    __metadata("design:paramtypes", [stats_service_1.StatsService])
], StatsController);
//# sourceMappingURL=stats.controller.js.map