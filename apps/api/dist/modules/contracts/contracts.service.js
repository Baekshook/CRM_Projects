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
var ContractsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contract_entity_1 = require("./entities/contract.entity");
let ContractsService = ContractsService_1 = class ContractsService {
    constructor(contractsRepository) {
        this.contractsRepository = contractsRepository;
        this.logger = new common_1.Logger(ContractsService_1.name);
    }
    async create(createContractDto) {
        const contract = this.contractsRepository.create(createContractDto);
        return this.contractsRepository.save(contract);
    }
    async findAll(query) {
        const options = {
            relations: ["schedule", "customer", "singer"],
        };
        if (query && query.status && query.status !== "all") {
            options.where = { ...options.where, contractStatus: query.status };
        }
        return this.contractsRepository.find(options);
    }
    async findOne(id) {
        const contract = await this.contractsRepository.findOne({
            where: { id },
            relations: ["schedule", "customer", "singer"],
        });
        if (!contract) {
            throw new common_1.NotFoundException(`Contract with ID "${id}" not found`);
        }
        return contract;
    }
    async update(id, updateContractDto) {
        const contract = await this.findOne(id);
        Object.assign(contract, updateContractDto);
        return this.contractsRepository.save(contract);
    }
    async remove(id) {
        const result = await this.contractsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Contract with ID "${id}" not found`);
        }
    }
    async sign(id, signContractDto) {
        const contract = await this.findOne(id);
        contract.contractStatus = "signed";
        contract.signedAt = new Date().toISOString();
        if (signContractDto.signature) {
            if (!contract.metadata) {
                contract.metadata = {};
            }
            contract.metadata.signature = signContractDto.signature;
            if (signContractDto.signerName) {
                contract.metadata.signerName = signContractDto.signerName;
            }
            if (signContractDto.signerRole) {
                contract.metadata.signerRole = signContractDto.signerRole;
            }
        }
        return this.contractsRepository.save(contract);
    }
    async getMonthlyStats() {
        this.logger.log("Getting monthly contract stats");
        return {
            labels: [
                "1월",
                "2월",
                "3월",
                "4월",
                "5월",
                "6월",
                "7월",
                "8월",
                "9월",
                "10월",
                "11월",
                "12월",
            ],
            datasets: [
                {
                    label: "계약 수",
                    data: [12, 19, 3, 5, 2, 3, 8, 9, 15, 12, 8, 10],
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
                {
                    label: "계약 금액 (백만원)",
                    data: [120, 190, 30, 50, 20, 30, 80, 90, 150, 120, 80, 100],
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                },
            ],
        };
    }
    async getCategoryStats() {
        this.logger.log("Getting category contract stats");
        return {
            labels: ["대형 공연", "소형 공연", "행사", "축제", "기타"],
            datasets: [
                {
                    label: "카테고리별 계약 수",
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }
    async getTypeStats() {
        this.logger.log("Getting type contract stats");
        return {
            labels: ["공연", "행사", "축제", "프로모션", "기업행사"],
            datasets: [
                {
                    label: "유형별 계약 수",
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }
    async getQuarterlyStats() {
        this.logger.log("Getting quarterly contract stats");
        return [
            {
                quarter: "2024 Q1",
                contractCount: 45,
                totalAmount: 450000000,
                averageAmount: 10000000,
            },
            {
                quarter: "2024 Q2",
                contractCount: 38,
                totalAmount: 380000000,
                averageAmount: 10000000,
            },
            {
                quarter: "2024 Q3",
                contractCount: 42,
                totalAmount: 420000000,
                averageAmount: 10000000,
            },
            {
                quarter: "2024 Q4",
                contractCount: 50,
                totalAmount: 500000000,
                averageAmount: 10000000,
            },
        ];
    }
    async getTopCustomers(limit = 5) {
        this.logger.log(`Getting top ${limit} customers by contract amount`);
        return [
            { name: "김민수", totalAmount: 50000000, contractCount: 5 },
            { name: "이지영", totalAmount: 45000000, contractCount: 4 },
            { name: "박준호", totalAmount: 40000000, contractCount: 4 },
            { name: "최서연", totalAmount: 35000000, contractCount: 3 },
            { name: "정민재", totalAmount: 30000000, contractCount: 3 },
        ].slice(0, limit);
    }
    async getTopSingers(limit = 5) {
        this.logger.log(`Getting top ${limit} singers by contract amount`);
        return [
            { name: "가수A", totalAmount: 60000000, contractCount: 6 },
            { name: "가수B", totalAmount: 55000000, contractCount: 5 },
            { name: "가수C", totalAmount: 50000000, contractCount: 5 },
            { name: "가수D", totalAmount: 45000000, contractCount: 4 },
            { name: "가수E", totalAmount: 40000000, contractCount: 4 },
        ].slice(0, limit);
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = ContractsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contract_entity_1.Contract)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map