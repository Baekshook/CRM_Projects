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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contract_entity_1 = require("../entities/contract.entity");
let StatsService = class StatsService {
    constructor(contractRepo) {
        this.contractRepo = contractRepo;
    }
    async getMonthlyStats(year) {
        const currentYear = year || new Date().getFullYear();
        const result = await this.contractRepo
            .createQueryBuilder("contract")
            .select("EXTRACT(MONTH FROM contract.signedAt)", "month")
            .addSelect("COUNT(contract.id)", "count")
            .addSelect("SUM(contract.amount)", "amount")
            .where("EXTRACT(YEAR FROM contract.signedAt) = :year", {
            year: currentYear,
        })
            .groupBy("month")
            .orderBy("month", "ASC")
            .getRawMany();
        const monthlyStats = Array(12)
            .fill(0)
            .map((_, index) => ({
            month: index + 1,
            count: 0,
            amount: 0,
        }));
        result.forEach((item) => {
            const monthIndex = parseInt(item.month) - 1;
            monthlyStats[monthIndex] = {
                month: parseInt(item.month),
                count: parseInt(item.count),
                amount: parseFloat(item.amount) || 0,
            };
        });
        return monthlyStats;
    }
    async getQuarterlyStats(year) {
        const currentYear = year || new Date().getFullYear();
        const monthlyStats = await this.getMonthlyStats(currentYear);
        const quarterlyStats = [
            { quarter: 1, count: 0, amount: 0 },
            { quarter: 2, count: 0, amount: 0 },
            { quarter: 3, count: 0, amount: 0 },
            { quarter: 4, count: 0, amount: 0 },
        ];
        monthlyStats.forEach((monthStat) => {
            const quarterIndex = Math.floor((monthStat.month - 1) / 3);
            quarterlyStats[quarterIndex].count += monthStat.count;
            quarterlyStats[quarterIndex].amount += monthStat.amount;
        });
        return quarterlyStats;
    }
    async getCategoryStats(year) {
        const currentYear = year || new Date().getFullYear();
        const result = await this.contractRepo
            .createQueryBuilder("contract")
            .select("contract.category", "category")
            .addSelect("COUNT(contract.id)", "count")
            .addSelect("SUM(contract.amount)", "amount")
            .where("EXTRACT(YEAR FROM contract.signedAt) = :year", {
            year: currentYear,
        })
            .groupBy("contract.category")
            .orderBy("count", "DESC")
            .getRawMany();
        return result.map((item) => ({
            category: item.category,
            count: parseInt(item.count),
            amount: parseFloat(item.amount) || 0,
        }));
    }
    async getTypeStats(year) {
        const currentYear = year || new Date().getFullYear();
        const result = await this.contractRepo
            .createQueryBuilder("contract")
            .select("contract.type", "type")
            .addSelect("COUNT(contract.id)", "count")
            .addSelect("SUM(contract.amount)", "amount")
            .where("EXTRACT(YEAR FROM contract.signedAt) = :year", {
            year: currentYear,
        })
            .groupBy("contract.type")
            .orderBy("count", "DESC")
            .getRawMany();
        return result.map((item) => ({
            type: item.type,
            count: parseInt(item.count),
            amount: parseFloat(item.amount) || 0,
        }));
    }
    async getTopCustomers(limit = 5) {
        const result = await this.contractRepo
            .createQueryBuilder("contract")
            .leftJoin("contract.customer", "customer")
            .select("customer.id", "customerId")
            .addSelect("customer.name", "customerName")
            .addSelect("customer.company", "customerCompany")
            .addSelect("COUNT(contract.id)", "contractCount")
            .addSelect("SUM(contract.amount)", "totalAmount")
            .groupBy("customer.id")
            .addGroupBy("customer.name")
            .addGroupBy("customer.company")
            .orderBy("totalAmount", "DESC")
            .limit(limit)
            .getRawMany();
        return result.map((item) => ({
            customerId: item.customerId,
            customerName: item.customerName,
            customerCompany: item.customerCompany,
            contractCount: parseInt(item.contractCount),
            totalAmount: parseFloat(item.totalAmount) || 0,
        }));
    }
    async getTopSingers(limit = 5) {
        const result = await this.contractRepo
            .createQueryBuilder("contract")
            .leftJoin("contract.singer", "singer")
            .select("singer.id", "singerId")
            .addSelect("singer.name", "singerName")
            .addSelect("singer.agency", "singerAgency")
            .addSelect("COUNT(contract.id)", "contractCount")
            .addSelect("SUM(contract.amount)", "totalAmount")
            .groupBy("singer.id")
            .addGroupBy("singer.name")
            .addGroupBy("singer.agency")
            .orderBy("totalAmount", "DESC")
            .limit(limit)
            .getRawMany();
        return result.map((item) => ({
            singerId: item.singerId,
            singerName: item.singerName,
            singerAgency: item.singerAgency,
            contractCount: parseInt(item.contractCount),
            totalAmount: parseFloat(item.totalAmount) || 0,
        }));
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contract_entity_1.Contract)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StatsService);
//# sourceMappingURL=stats.service.js.map